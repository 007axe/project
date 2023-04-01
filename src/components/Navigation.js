import { ethers } from 'ethers'
import CarImage from '../assets/ETH.png'

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (

        <nav>
            <div className='nav__brand'>
            <div class="nav-img"> 
            <img src={CarImage} alt="car"/>
            </div>
            <h1>ร้านค้าเกษตกร</h1>
            </div>



            {account ? (
                <button
                    type="button"
                    className='nav__connect'
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    เชื่อมต่อบัญชี
                </button>
            )}

                
        </nav>


        
       
    );
}

export default Navigation;