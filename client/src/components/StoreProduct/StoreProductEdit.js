import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import {Link, useNavigate, useParams} from 'react-router-dom';

const StoreProductEdit = () => {
    const initialFormState = {
        upc: '',
        upc_prom: '',
        id_product: '',
        selling_price: '',
        products_number: '',
        promotional_product: false,
    };

    const [storeProduct, setStoreProduct] = useState(initialFormState);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        fetch(`/api/products`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            });
    }, []);

    useEffect(() => {
        fetch(`/api/store-products/${id}`)
            .then(response => response.json())
            .then(data => {
                setStoreProduct(data);
            });
    }, [id]);

    const handleChange = (event) => {
        const {name, value, type, checked } = event.target;
        const newValue = (name === 'id_product') ? parseInt(value) : value;
        const parsedValue = (newValue === 'on') ? true : (newValue === '') ? false : newValue;
        const parsedParsedValue = (type === 'checkbox') ? checked : parsedValue;
        setStoreProduct({...storeProduct, [name]: parsedParsedValue});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        await fetch(`/api/store-products${storeProduct.upc ? `/${storeProduct.upc}` : ''}`, {
            method: (storeProduct.upc) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(storeProduct)
        });
        setStoreProduct(initialFormState);
        navigate('/store-products');
    };

    const productsOptions = products.map((product) => {
        return (
            <option key={product.id_product} value={product.id_product}>
                {product.id_product} - {product.product_name}
            </option>
        );
    });

    return (
        <div>
            <AppNavbar/>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="id_product">Product</Label>
                    <Input
                        type="select"
                        name="id_product"
                        id="id_product"
                        required
                        value={storeProduct.id_product || ''}
                        onChange={handleChange}>
                        <option value="">Select Product</option>
                        {productsOptions}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="selling_price">Selling Price</Label>
                    <Input
                        type="number"
                        name="selling_price"
                        id="selling_price"
                        required
                        value={storeProduct.selling_price || ''}
                        onChange={handleChange}
                        autoComplete="selling_price"
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="products_number">Products Number</Label>
                    <Input
                        type="number"
                        name="products_number"
                        id="products_number"
                        required
                        value={storeProduct.products_number || ''}
                        onChange={handleChange}
                        autoComplete="products_number"
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="promotional_product">Is promotional?</Label>
                    <Input
                        type="checkbox"
                        name="promotional_product"
                        id="promotional_product"
                        checked={storeProduct.promotional_product || false}
                        onChange={handleChange}
                        autoComplete="promotional_product"
                    />
                </FormGroup>

                <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to={"/store-products"}>Cancel</Button>
                </FormGroup>
            </Form>
        </div>
    );
};

export default StoreProductEdit;