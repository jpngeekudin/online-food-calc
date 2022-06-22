import { useState } from 'react';
import { OrderInterface, OrderResultInterface } from './models/OrderInterface';
import './styles/Styles.scss';

function App() {
  const [orderList, setOrderList] = useState<OrderInterface[]>([]);
  const [orderName, setOrderName] = useState<string>('');
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const [otherPrice, setOtherPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [discountLimit, setDiscountLimit] = useState<number>(0);
  const [result, setResult] = useState<OrderResultInterface[]>([]);

  const addOrder = () => {
    if (!orderName || !orderPrice) return;
    const currentOrderList = orderList;
    currentOrderList.push({ name: orderName, price: orderPrice });
    setOrderList(currentOrderList);
    setOrderName('');
    setOrderPrice(0);
  }

  const removeOrder = (index: number) => {
    const currentOrderList = orderList;
    orderList.splice(index, 1);
    setOrderList(currentOrderList);
  }

  const calculate = () => {
    if (!orderList.length) alert('Please input 1 or more order list');
    if (discount < 0 || discount > 100) alert('Discount invalid');

    const totalPrice = orderList.map(o => o.price).reduce((prev, curr) => prev + curr, 0);
    const totalDiscount = totalPrice * discount / 100;
    const totalDiscountedPrice = totalPrice - totalDiscount;
    const limitedDiscount = discountLimit > 0 && totalDiscountedPrice > discountLimit;

    const result: OrderResultInterface[] = orderList.map(order => {
      const orderTotalDiscount = limitedDiscount
        ? order.price / totalPrice * discountLimit
        : order.price * discount / 100;

      const discounted = order.price - orderTotalDiscount;
      const plusOthers = discounted + (otherPrice / orderList.length);
      return { name: order.name, price: plusOthers, discount: orderTotalDiscount }
    });

    setResult(result);
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className='bg-white rounded p-4' style={{ width: 600 }}>

        {/* add order section */}
        <div className="mb-3">
          <div className="fw-bold mb-3">Add Order</div>
          <div className="d-flex mb-3" style={{ gap: '20px' }}>
            <div style={{ flexGrow: 1 }}>
              <label htmlFor="">Name</label>
              <input type="text" name="" id="" className="form-control" onChange={e => setOrderName(e.target.value)} value={orderName} />
            </div>
            <div style={{ flexGrow: 1 }}>
              <label htmlFor="">Price</label>
              <div className="input-group">
                <span className="input-group-text">Rp.</span>
                <input type="number" name="" id="" className="form-control" onChange={e => setOrderPrice(Number(e.target.value))} value={orderPrice} />
              </div>
            </div>
          </div>
          <div className="text-end">
            <button className="btn btn-light" onClick={addOrder}>Add Order</button>
          </div>
        </div>

        {/* order list section */}
        <div className="mb-3">
          <div className="fw-bold mb-3">Order List</div>
          {!orderList.length && 'No Order'}
          {orderList.map((order, index) => {
            return (
              <div className='d-flex py-1 px-2 border rounded mb-2' style={{ gap: 10 }}>
                <div style={{ flexGrow: 1 }}>{order.name}</div>
                <div style={{ flexGrow: 1 }}>Rp. {order.price}</div>
                <div style={{ cursor: 'pointer' }} onClick={() => removeOrder(index)}>❌</div>
              </div>
            );
          })}
        </div>

        {/* others */}
        <div className="mb-3">
          <div className="d-flex mb-3" style={{ gap: 20 }}>
            <div style={{ flexGrow: 1 }}>
              <div className="fw-bold mb-3">Discount</div>
              <div className="input-group">
                <input type="number" name="" id="" className="form-control" onChange={e => setDiscount(Number(e.target.value))} value={discount} />
                <span className="input-group-text">%</span>
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <div className="fw-bold mb-3">Discounted Limit (0 = Unlimited)</div>
              <div className="input-group">
                <span className="input-group-text">Rp.</span>
                <input type="number" name="" id="" className="form-control" onChange={e => setDiscountLimit(Number(e.target.value))} value={discountLimit} />
              </div>
            </div>
          </div>
          <div>
            <div className="fw-bold mb-3">Ongkir dkk.</div>
            <div className="input-group">
              <span className="input-group-text">Rp.</span>
              <input type="number" name="" id="" className="form-control" onChange={e => setOtherPrice(Number(e.target.value))} value={otherPrice} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary w-100" onClick={calculate}>
          Calculate
        </button>

        {/* result */}
        {
          result.length > 0 && (
              <div className='mt-4'>
              <div className="fw-bold mb-3">Result</div>
              <table className="table table-striped">
                <thead>
                  <th>Name</th>
                  <th>Price</th>
                </thead>
                <tbody>
                  {result.map(res => {
                    return (
                      <tr>
                        <td>{res.name}</td>
                        <td>
                          <span className="me-2">Rp. {res.price.toFixed()}</span>
                          <span className="text-danger fw-bold">(- Rp. {res.discount?.toFixed()})</span></td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className='text-end' colSpan={2}>
                      <span className='me-2'>Total: Rp. {result.map(r => r.price).reduce((prev, curr) => prev + curr, 0)}</span>
                      <span className='text-danger fw-bold'>(- Rp. {result.map(r => r.discount || 0).reduce((prev, curr) => prev + curr, 0)})</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
