import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import axios from 'axios';

export default function App() {
    const [ageCategory, setAgeCategory] = useState('adult');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [stone, setStone] = useState('kg');
    const [stonePounds, setStonePounds] = useState('');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [bmiResult, setBmiResult] = useState('');
    const [bmiStatus, setBmiStatus] = useState('');

    const calculateBMI = () => {
        let weightInKg = parseFloat(weight);

        if (weightUnit === 'lb') {
            weightInKg = weightInKg * 0.453592; // Convert pounds to kilograms
        } else if (weightUnit === 'stone') {
            const stonePoundsInKg = parseFloat(stonePounds) * 0.453592;
            const stoneInKg = parseFloat(weight) * 6.35029; // Convert stone to kilograms
            weightInKg = stoneInKg + stonePoundsInKg;
        }

        let heightInM = parseFloat(height);

        if (heightUnit === 'ft') {
            const heightInInches = parseFloat(height) * 12 + parseFloat(inches);
            heightInM = heightInInches * 0.0254; // Convert feet and inches to meters
        } else if (heightUnit === 'cm') {
            heightInM = heightInM * 0.01; // Convert centimeters to meters
        }

        const bmi = (weightInKg / (heightInM * heightInM)).toFixed(1);
        setBmiResult(`BMI = ${bmi}`);

        // Determine BMI status
        let status;
        if (ageCategory === 'adult') {
            status = getAdultBMIStatus(bmi);
        } else {
            status = getChildBMIStatus(bmi);
        }
        setBmiStatus(status);

        const bmiData = {
            ageCategory: ageCategory,
            weightInKg: weightInKg,
            weightUnit: weightUnit,
            heightInM: heightInM,
            heightUnit: heightUnit,
            bmiResult: bmi,
            bmiStatus: status,
        };

        const bmiDataJSON = JSON.stringify(bmiData); // Convert to JSON string
        console.log(bmiDataJSON); // Log the JSON string

        axios.post('http://192.168.1.21/bmi-calculator/save_result.php', bmiData)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error saving transaction:', error);
            });
    };


    const getAdultBMIStatus = (bmi) => {
        if (bmi <= 18.4) {
            return 'Underweight';
        } else if (bmi <= 24.9) {
            return 'Normal';
        } else if (bmi <= 29.9) {
            return 'Overweight';
        } else {
            return 'Obese';
        }
    };

    const getChildBMIStatus = (bmi) => {
        let percentile;

        if (bmi < 5.0) {
            percentile = '< 5th percentile';
            return `Underweight (${percentile})`;
        } else if (bmi >= 5.0 && bmi < 85.0) {
            percentile = '5th - 85th percentile';
            return `Normal (${percentile})`;
        } else if (bmi >= 85.0 && bmi < 95.0) {
            percentile = '85th - 95th percentile';
            return `Overweight (${percentile})`;
        } else {
            percentile = '>= 95th percentile';
            return `Obese (${percentile})`;
        }
    };

    const clearInputs = () => {
        setWeight('');
        setStone('');
        setStonePounds('');
        setHeight('');
        setFeet('');
        setInches('');
        setBmiResult('');
        setBmiStatus('');
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.outerContainer}>
                <View style={styles.container}>
                    <View style={styles.redContainer}>
                        <Text style={styles.headerText}>Adult and Child BMI Calculator</Text>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.subHeaderText}>Calculate BMI for</Text>
                        <View style={styles.pickerContainer}>
                            <PickerSelect
                                value={ageCategory}
                                onValueChange={(value) => setAgeCategory(value)}
                                items={[
                                    { label: 'Adult (20+)', value: 'adult' },
                                    { label: 'Child (2-19)', value: 'child' },
                                ]}
                                style={{
                                    inputIOS: {
                                        height: 30,
                                        width: 135,
                                        marginLeft: 5,
                                        paddingLeft: 6,
                                        fontSize: 18,
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 4,
                                        color: 'black',
                                        paddingRight: 30,
                                        backgroundColor: 'white',
                                    },
                                    inputAndroid: {
                                        height: 30,
                                        width: 160,
                                        marginTop: -25,
                                        marginLeft: 5,
                                        paddingLeft: 6,
                                        fontSize: 18,
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 4,
                                        color: 'black',
                                        paddingRight: 30,
                                        backgroundColor: 'white',
                                    },

                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Weight:</Text>
                        </View>
                        <View style={styles.inputPickerContainer}>
                            <TextInput
                                style={[styles.input, { paddingTop: 0, paddingBottom: 0 }]}
                                keyboardType="numeric"
                                placeholder="Enter weight"
                                placeholderTextColor="gray"
                                value={weight}
                                onChangeText={(text) => setWeight(text)}
                            />
                            <PickerSelect
                                value={weightUnit}
                                onValueChange={(value) => setWeightUnit(value)}
                                items={[
                                    { label: 'kg', value: 'kg' },
                                    { label: 'lb', value: 'lb' },
                                    { label: 'stone', value: 'stone' },
                                ]}
                                style={{
                                    inputIOS: {
                                        height: 30,
                                        width: 90,
                                        paddingLeft: 7,
                                        marginLeft: 5,
                                        fontSize: 18,
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 4,
                                        color: 'black',
                                        paddingRight: 30,
                                        backgroundColor: 'white',
                                    },
                                    inputAndroid: {
                                        height: 30,
                                        width: 120,
                                        marginTop: -11.5,
                                        paddingLeft: 7,
                                        marginLeft: 5,
                                        fontSize: 18,
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 4,
                                        color: 'black',
                                        paddingRight: 30,
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                        </View>
                    </View>

                    {weightUnit === 'stone' && (
                        <View style={styles.stonePoundsContainer}>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="Pounds"
                                placeholderTextColor="gray"
                                value={stonePounds}
                                onChangeText={(text) => setStonePounds(text)}
                            />
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <View style={styles.labelContainerHeight}>
                            <Text style={styles.label}>Height:</Text>
                        </View>
                        <View style={styles.inputPickerContainer}>
                            <TextInput
                                style={styles.inputHeight}
                                keyboardType="numeric"
                                placeholder="Enter height"
                                placeholderTextColor="gray"
                                value={height}
                                onChangeText={(text) => setHeight(text)}
                            />
                            <PickerSelect
                                value={heightUnit}
                                onValueChange={(value) => setHeightUnit(value)}
                                items={[
                                    { label: 'cm', value: 'cm' },
                                    { label: 'ft', value: 'ft' },
                                    { label: 'm', value: 'm' },
                                ]}
                                style={{
                                    inputIOS: {
                                        height: 30,
                                        width: 90,
                                        paddingLeft: 6,
                                        marginLeft: 5,
                                        fontSize: 18,
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 4,
                                        color: 'black',
                                        paddingRight: 30,
                                        backgroundColor: 'white',
                                    },
                                    inputAndroid: {
                                        height: 10,
                                        width: 120,
                                        marginTop: -11.5,
                                        paddingLeft: 6,
                                        marginLeft: 5,
                                        fontSize: 18,
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 4,
                                        color: 'black',
                                        paddingRight: 30,
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                        </View>
                    </View>

                    {heightUnit === 'ft' && (
                        <View style={styles.rowContainer}>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="Inches"
                                placeholderTextColor="gray"
                                value={inches}
                                onChangeText={(text) => setInches(text)}
                            />
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <View style={[styles.clearButton, { flex: 0.7 }]}>
                            <Button title="Clear" onPress={clearInputs} color="#1E90FF" />
                        </View>
                        <View style={styles.calculateButton}>
                            <Button title="Calculate" onPress={calculateBMI} color="#1E90FF" />
                        </View>
                    </View>

                    <View style={styles.resultContainer}>
                        <View style={styles.answerContainer}>
                            <Text style={styles.answerLabel}>Answer:</Text>
                            <Text style={styles.resultText}>{bmiResult}</Text>
                            <Text style={styles.statusText}>{bmiStatus}</Text>
                            {/* Table */}
                            <View style={styles.tableContainer}>
                                <View style={[styles.tableRow, { backgroundColor: '#e9e8e9' }]}>
                                    <Text style={styles.tableCell}>BMI</Text>
                                    <View style={styles.divider} />
                                    <Text style={[styles.tableCell, styles.lastTableCell]}>Status</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { backgroundColor: '#fee188' }]}>≤18.4</Text>
                                    <View style={styles.divider} />
                                    <Text style={[styles.tableCell, styles.lastTableCell]}>Underweight</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { backgroundColor: '#8dd47f' }]}>18.5 - 24.9</Text>
                                    <View style={styles.divider} />
                                    <Text style={[styles.tableCell, styles.lastTableCell]}>Normal</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { backgroundColor: '#ffb44d' }]}>25.0 - 29.9</Text>
                                    <View style={styles.divider} />
                                    <Text style={[styles.tableCell, styles.lastTableCell]}>Overweight</Text>
                                </View>
                                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                                    <Text style={[styles.tableCell, { backgroundColor: '#fe6861' }]}>≥ 30.0</Text>
                                    <View style={styles.divider} />
                                    <Text style={[styles.tableCell, styles.lastTableCell]}>Obese</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f1f1',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 623, // Set the desired height here
        width: 320,
        borderRadius: 10, // Add border radius for rounded corners
        borderWidth: 1,  // Add border width
        borderColor: 'gray',  // Border color
        padding: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 180.5,
    },
    stonePoundsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 180.5,
        marginBottom: 5,
    },
    pickerContainer: {
        marginBottom: 10,
        width: 200,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        backgroundColor: '#f0f1f1',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 30,
    },
    labelContainer: {
        marginRight: 10,
    },
    labelContainerHeight: {
        marginRight: 12.5,
    },
    label: {
        fontSize: 16,
    },
    inputPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f1f1',

    },
    input: {
        fontSize: 18,
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        width: 120,
        textAlign: 'center',
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 6,
        backgroundColor: 'white',
    },
    inputHeight: {
        fontSize: 18,
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        width: 120,
        textAlign: 'center',
        padding: 0,
        paddingVertical: 0,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: 'white',
    },
    outerContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginBottom: 50,
        marginTop: 50,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    pickerContainer: {
        flex: 0.9, // Adjust the flex value to control the width (e.g., 0.7 for 70% width)
    },
    redContainer: {
        backgroundColor: '#b74b38',
        padding: 10,
        borderRadius: 5,
        width: 310,
        marginTop: -12,
        marginBottom: 20, // Add margin at the bottom for separation
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16, // Adjust the font size as needed
        color: 'white',
        fontWeight: 'bold',
    },
    tableContainer: {
        width: 215,
        marginTop: 10,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#aaabab',
        overflow: 'hidden',
        marginLeft: 10,
        marginLeft: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#aaabab',
    },
    tableCell: {
        flex: 1,
        padding: 2,
        textAlign: 'center',
        borderRightWidth: 0.5,
        borderColor: '#aaabab',
        height: 25,
        
    },
    lastTableCell: {
        flex: 1,
        padding: 2,
        textAlign: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: '#aaabab',
        height: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
        marginBottom: 10,
        marginRight: -7,
        marginLeft: -6,
    },
    clearButton: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#f0f1f1',
        borderWidth: 1,
        borderColor: '#aaabab',
    },
    calculateButton: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#f0f1f1',
        borderWidth: 1,
        borderColor: '#aaabab',
    },
    resultContainer: {
        position: 'absolute',
        left: 4,
        right: 4, 
        bottom: 4,
        backgroundColor: '#fffefe',
        borderColor: 'gray',
        borderWidth: 1,
        height: 232,
        width: 310,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,

        
    },
    resultText: {
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
        fontSize: 20, // Adjust the font size as needed
        fontWeight: 'bold',
    },
    statusText: {
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
        fontSize: 14, // Adjust the font size as needed
        fontWeight: 'bold',
    },
    answerLabel: {
        textAlign: 'left',
        fontSize: 16,
        marginTop: -10,
        marginLeft: -30,
    },
    answerContainer: {
        width: 250,  // Set a fixed width for the answer container
        paddingHorizontal: 10,
      },
});
