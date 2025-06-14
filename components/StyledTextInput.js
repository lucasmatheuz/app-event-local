import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const StyledTextInput = (props) => {
    const { multiline } = props;
    const inputStyle = [styles.input];

    if (multiline) {
        inputStyle.push(styles.multilineInput);
    }
    
    return (
        <TextInput
            mode="outlined"
            {...props}
            style={inputStyle}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 16,
    },
    multilineInput: {
        height: 120, // Altura fixa para multiline
        textAlignVertical: 'top', // Garante que o texto comece do topo
    },
});

export default StyledTextInput;