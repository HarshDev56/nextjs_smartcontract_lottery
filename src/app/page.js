"use client"
import { MoralisProvider } from "react-moralis"
import Header from "./components/Header"
import LotteryEnterance from "./components/LotteryEnterance"
import { NotificationProvider } from "web3uikit"
import styles from "./page.module.css"
export default function Home() {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <div className={styles.container}>
                    <Header />
                    <LotteryEnterance />
                </div>
            </NotificationProvider>
        </MoralisProvider>
    )
}
