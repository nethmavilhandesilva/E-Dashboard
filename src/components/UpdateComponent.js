import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
        console.warn(params);
        let result = await fetch(`http://localhost:5000/product/${params.id}`);
        result = await result.json();
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
    };

    const updateProduct = async () => {
        console.warn(name, price, category, company);
        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            method: 'Put',
            body: JSON.stringify({ name, price, category, company }),
            headers: {
                'Content-Type': 'Application/json'
            }

        });
        await result.json()
        console.warn(result)
        if (result) {
            navigate('/')
        }
    };

    return (
        <div className='product'>
            <h1>Update Product</h1>
            <input type='text' placeholder='Enter Product Name' className='inputBox'
                value={name} onChange={(e) => setName(e.target.value)} />

            <input type='text' placeholder='Enter Product Price' className='inputBox'
                value={price} onChange={(e) => setPrice(e.target.value)} />

            <input type='text' placeholder='Enter Product Category' className='inputBox'
                value={category} onChange={(e) => setCategory(e.target.value)} />

            <input type='text' placeholder='Enter Product Company' className='inputBox'
                value={company} onChange={(e) => setCompany(e.target.value)} />

            <button onClick={updateProduct} className='appButton'>Update Product</button>
        </div>
    );
};

export default UpdateProduct;
