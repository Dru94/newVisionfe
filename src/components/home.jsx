import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import "../styles/style.css";

export default function Home(props) {
  const [books, setBooks] = useState([]);
  const [modal, setModal] = useState("modalDivClose");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [details, setDetails] = useState({});
  const [pendingOrder, setPendingOrder] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/books/")
      .then((res) => {
        setBooks(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const detailsFunc = (details) => {
    let detail_obj = {
      title: details.title,
      cost: details.cost,
      teachers_guide: details.teachers_guide,
      class_number: details.class_number,
      level: details.level,
      subject: details.subject,
    };
    console.log(details);
    setDetails(detail_obj);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(data.entries());

    const order_object = {
      item_title: details.title,
      class_no: details.class_number,
      level: details.level,
      order_quantity: values.st_copy,
      teachers_quantity: values.teachers_g,
    };

    axios
      .post("http://127.0.0.1:8000/books/add-order", order_object)
      .then((res) => {
        if (res.status === 201) {
          setSuccess(true);
          setModal("modalDivClose");
        } else {
          setError(true);
        }
      })
      .catch((e) => console.log(e));

    setSuccess(false);
    setError(false);
  };

  const getPendingOrders = () => {
    let results = [];
    axios
      .get("http://127.0.0.1:8000/books/orders")
      .then((res) => {
        if (res.data.status === 200) {
          for (const d of res.data) {
            if (d.cleared !== true) {
              console.log(d);
              results.push(d);
            }
          }
          setPendingOrder(results);
        } else {
          setError(true);
        }
      })
      .catch((e) => console.log(e));
  };

  const sendOrder = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(data.entries());
    const send_data = {
      orders: pendingOrder,
      name: values.name,
      tel: values.tel,
      address: values.address,
      email: values.email,
      comment: values.comment,
    };
    axios
      .post("http://127.0.0.1:8000/books/send-order", send_data)
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          setPendingOrder([]);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <div className="wrapper">
        <div className="tableDiv">
          <table className="tbl">
            <tr>
              <th>Subject</th>
              <th>Cost</th>
              <th>Teachers Guide</th>
            </tr>
            {books.map((data, index) => {
              return (
                <tr
                  onClick={() => {
                    setModal("modalDivOpen");
                    detailsFunc(data);
                  }}
                  key={index}
                >
                  <td>{data.title}</td>
                  <td>{data.cost}</td>
                  <td>{data.teachers_guide}</td>
                </tr>
              );
            })}
          </table>
          <div className="orders">
            <h3>Orders.</h3>
            <Button onClick={getPendingOrders}>Click to refresh</Button>
            {pendingOrder.length === 0 ? (
              <h4>No Orders.</h4>
            ) : error === true ? (
              <h4>An error occured. Try again.</h4>
            ) : (
              <div className="orderWrapper">
                {pendingOrder.map((data, index) => {
                  return (
                    <div className="orderCard" key={index}>
                      <p>
                        Class:{" "}
                        <span className="orderCardData">
                          {data.level} {data.class_no}
                        </span>
                      </p>
                      <p>
                        {" "}
                        Book Title:{" "}
                        <span className="orderCardData">{data.item_title}</span>
                      </p>
                      <p>
                        Books Quantity:{" "}
                        <span className="orderCardData">
                          {data.order_quantity}
                        </span>
                      </p>
                      <p>
                        Teacher Guide Quantity:{" "}
                        <span className="orderCardData">
                          {data.teachers_quantity}
                        </span>
                      </p>
                    </div>
                  );
                })}
                <div className="formDiv">
                  <form onSubmit={sendOrder}>
                    <label htmlFor="name">Full Name: </label>
                    <br />
                    <input type="text" id="name" name="name" />
                    <br />
                    <br />
                    <label htmlFor="tel">Telephone: </label>
                    <br />
                    <input type="text" id="tel" name="tel" />
                    <br />
                    <br />
                    <label htmlFor="address">Address: </label>
                    <br />
                    <input type="text" id="address" name="address" />
                    <br />
                    <br />
                    <label htmlFor="email">Email: </label>
                    <br />
                    <input type="email" id="email" name="email" />
                    <br />
                    <br />
                    <label htmlFor="comment">Comment: </label>
                    <br />
                    <textarea name="comment" id="comment"></textarea>
                    <br />
                    <br />
                    <button type="submit"> Send Order </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={modal}>
          {Object.keys(details).length !== 0 ? (
            <div>
              <button
                onClick={() => {
                  setModal("modalDivClose");
                  setDetails({});
                }}
                style={{ backgroundColor: "red" }}
              >
                Cancel
              </button>
              <div className="dtl">
                <p>Title : {details.title}</p>
                <p>
                  Class : {details.level} {details.class_number}
                </p>
                <p>Cost : {details.cost}</p>
                <p>Teacher's Guide : {details.teachers_guide}</p>
              </div>
              <div className="orderForm">
                <form onSubmit={handleSubmit}>
                  <label htmlfor="teachers">
                    Teachers guide number of copies:{" "}
                  </label>
                  <input type="number" id="teachers" name="teachers_g" />
                  <br />
                  <br />
                  <label htmlfor="copies">Number of copies: </label>
                  <input type="number" id="copies" name="st_copy" />
                  <br />
                  <br />
                  <Button color="success" type="submit">
                    Add to Order
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </div>
    </>
  );
}
