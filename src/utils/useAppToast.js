import { useToast } from "@chakra-ui/react";

/**
 * A thin wrapper around Chakra's useToast that pre-fills the
 * common duration and isClosable defaults used throughout the app.
 *
 * Usage:
 *   const toast = useAppToast();
 *   toast("Sėkmė", "Įrašas sėkmingai išsaugotas.");
 *   toast("Klaida", "Nepavyko išsaugoti.", "error");
 */
export function useAppToast() {
  const toast = useToast();
  return (title, description, status = "success") =>
    toast({ title, description, status, duration: 5000, isClosable: true });
}

