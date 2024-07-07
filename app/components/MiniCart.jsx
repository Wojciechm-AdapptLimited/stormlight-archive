import {React} from "react";


const MiniCart = () => {
    const [total, setTotal] = React.useState(0);
    const [description, setDescription] = React.useState("");

    React.useEffect(async () => {
        const response = await fetch("/cart/total");

        if (!response.ok) {
            console.log("Error retrieving cart");
            return;
        }

        const cartTotal = await response.json();
        setTotal(cartTotal);

        if (cartTotal === 0) {
            setDescription("Your cart is empty");
        }
    });
};