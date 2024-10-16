import React, { useState } from "react";
import {
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Box,
  List,
  ListItem,
  Text,
  HStack,
} from "@chakra-ui/react";

export const ConfirmEnd = ({ open, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  const handleEnd = () => {
    console.log("finished");
    onClose();
  };
  return (
    <Modal isOpen={open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent p="1rem">
        Ar tikrai norite baigti testą?
        <ModalFooter>
          <HStack>
            <Button onClick={handleClose}>Uždaryti</Button>
            <Button colorScheme="red" onClick={handleEnd}>
              Baigti testą
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
