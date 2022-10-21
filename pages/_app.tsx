import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { publicProvider } from 'wagmi/providers/public'
import { MantineProvider } from '@mantine/core'
import Layout from '../components/Layout'
import { ApolloProvider } from "@apollo/client";
import client from '../utils/apollo-client'

function MyApp({ Component, pageProps }: AppProps) {
  const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;

  const mumbaiChain: Chain = {
    id: 80001,
    name: 'Mumbai',
    network: 'mumbai',
    nativeCurrency: {
      decimals: 18,
      name: 'Mumbai',
      symbol: 'MATIC',
    },
    rpcUrls: {
      default: ALCHEMY_ID,
    },
    blockExplorers: {
      default: { name: '', url: '' },
    },
    testnet: true
  }

  const { chains, provider } = configureChains(
    [mumbaiChain],
    [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id !== mumbaiChain.id) return null
          return { http: chain.rpcUrls.default }
        },
      }),
      publicProvider()
    ],
  );
  
  const wagmiClient = createClient(
    getDefaultClient({
      appName: "Web3RSVP",
      chains,
      provider
    }),
  );

  return (
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider>
        <ApolloProvider client={client}>
          <MantineProvider 
            theme={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontFamilyMonospace: 'Space Grotesk, Courier, monospace',
              headings: { fontFamily: 'Space Grotesk, sans-serif' },
            }}
            withGlobalStyles 
            withNormalizeCSS
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MantineProvider>
        </ApolloProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
