// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.100", // You can choose any gray color from Chakra's color scale
      },
    },
  },
});

export default theme;
