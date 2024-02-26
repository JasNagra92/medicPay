import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const DisclaimerModal = ({
  visible,
  onClose,
}: {
  visible: any;
  onClose: any;
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Disclaimer</Text>
          <Text>
            Pay cheque estimates are just estimates and accuracy is not
            guaranteed
          </Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text style={{ color: "blue", fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DisclaimerModal;
