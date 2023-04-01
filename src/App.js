import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'
import Titles from './components/Title'



// ABIs
import Farmer from './abis/Farmer.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [farmer, setFarmer] = useState(null)

  const [account, setAccount] = useState(null)

  const [seeds, setSeeds] = useState(null)
  const [fertilizers, setFertilizers] = useState(null)
  const [herbicides, setHerbicides] = useState(null)


  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadblockchainData = async () => {
    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log(network)
    
    // Connect to smartcontracts (Create Js versions)
    const farmer = new ethers.Contract(config[network.chainId].farmer.address, Farmer, provider)
    setFarmer(farmer)
    
      // Load products

      const items = []

      for (var i = 0; i < 9; i++) {
        const item = await farmer.items(i + 1)
        items.push(item)
      }

      const seeds = items.filter((item) => item.category === 'seeds')
      const fertilizers = items.filter((item) => item.category === 'fertilizers')
      const herbicides = items.filter((item) => item.category === 'herbicides')


      setSeeds(seeds)
      setFertilizers(fertilizers)
      setHerbicides(herbicides)

  }

  useEffect(() => {
    loadblockchainData()  
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Titles/>

      {/* <h2>สินค้าขายดี!!</h2> */}
      {/* <p>{ account}</p> */}
      

          <ul className='nav__links'>
            <li><a href="#เมล็ดพันธุ์">เมล็ดพันธุ์</a></li>
            <li><a href="#ปุ๋ย">ปุ๋ย</a></li>
            <li><a href="#สารกำจัดวัชพืช">สารกำจัดวัชพืช</a></li>
          </ul>

      {seeds && fertilizers && herbicides && (
        <>
          <Section title={"เมล็ดพันธุ์"} items={seeds} togglePop={togglePop} />
          <Section title={"ปุ๋ย"} items={fertilizers} togglePop={togglePop} />
          <Section title={"สารกำจัดวัชพืช"} items={herbicides} togglePop={togglePop} />
        </>
      )}
       {toggle && (
        <Product item={item} provider={provider} account={account} farmer={farmer} togglePop={togglePop} />
      )}
      
    </div>
  );
}

export default App;
