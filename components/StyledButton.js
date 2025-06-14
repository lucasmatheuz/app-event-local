import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const StyledButton = ({ children, ...props }) => {
    return (
        <Button
            style={styles.button}
            labelStyle={styles.label}
            mode="contained"
            {...props}
        >
            {children}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 8,
        marginBottom: 8,
        paddingVertical: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StyledButton;