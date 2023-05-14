import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../../../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Bell, Button, Input, useNotification } from "web3uikit"

export default function LotteryEnterance() {
    const [enteranceFee, setEnteranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    console.log(parseInt(chainIdHex))

    const dispatch = useNotification()

    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const {
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //need to speify network
        functionName: "enterRaffle",
        params: {},
        msgValue: enteranceFee,
    })
    const { runContractFunction: getEnteranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //need to speify network
        functionName: "getEnteranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //need to speify network
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //need to speify network
        functionName: "getRecentWinner",
        params: {},
    })
    async function updateUI() {
        const enteranceFeeFromContract = (await getEnteranceFee()).toString()
        setEnteranceFee(enteranceFeeFromContract)
        const numOfPlayersFromContract = (await getNumberOfPlayers()).toString()
        setNumPlayers(numOfPlayersFromContract)
        const recentWinnerFromContract = (await getRecentWinner()).toString()
        setRecentWinner(recentWinnerFromContract)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSucess = async function (tx) {
        await tx.wait(1)
        handleNewNotifications(tx)
        updateUI()
    }
    const handleNewNotifications = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: <Bell fontSize={20} />,
        })
    }
    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <Button
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSucess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        text="Enter Raffle"
                        theme="primary"
                        disabled={isFetching || isLoading}
                    />
                    <div>Entrance Fee: {ethers.utils.formatUnits(enteranceFee, "ether")} ETH</div>
                    <div>Total Players: {numPlayers}</div>
                    <div>Recent Winner is: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Detected!</div>
            )}
        </div>
    )
}
