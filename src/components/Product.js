import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'
import close from '../assets/close.svg'

const Product = ({ item, provider, account, farmer, togglePop }) => {
  const [order, setOrder] = useState(null)
  const [hasBought, setHasBought] = useState(false)

  const fetchDetails = async () => {
    const events = await farmer.queryFilter("Buy")
    const orders = events.filter(
      (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    )

    if (orders.length === 0) return

    const order = await farmer.orders(account, orders[0].args.orderId)
    setOrder(order)
  }

  const buyHandler = async () => {
    const signer = await provider.getSigner()

    // Buy item...
    let transaction = await farmer.connect(signer).buy(item.id, { value: item.cost })
    await transaction.wait()

    setHasBought(true)
  }

  useEffect(() => {
    fetchDetails()
  }, [hasBought])

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          

          <Rating value={item.rating} />

          <hr />

          <p>{item.address}</p>

          <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>

          <hr />

          <h2>ภาพรวม</h2>

          <p>{item.description}</p>
        </div>

        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>

          <p>
            ส่งฟรี <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </strong>
          </p>

          {item.stock > 0 ? (
            <h3>มีสินค้า</h3>
          ) : (
            <h3>สินค้าหมด</h3>
          )}

          <button className='product__buy' onClick={buyHandler}>
            ซื้อ
          </button>

          <p><small>ส่งจาก</small> ปทุมธานี</p>
          <p><small>ขายโดย</small> ร้านเกษตรออนไลน์</p>

          {order && (
            <div className='product__bought'>
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong>
              
            </div>
            
          )}
        </div>


        <button onClick={togglePop} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div >
  );
}

export default Product;