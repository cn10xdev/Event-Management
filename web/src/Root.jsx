import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig } from "swr";

import fetcher from "./utils/fetcher";

import App from "./App";
import AuthProvider from "./contexts/AuthContext";

export default function Root() {
  return (
    <BrowserRouter>
      <ChakraProvider>
        <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SWRConfig>
      </ChakraProvider>
    </BrowserRouter>
  );
}
