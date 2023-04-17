import React, { useState } from "react";
import axios from "axios";
import { Container, Form, FormGroup, Label, Input } from 'reactstrap';
import AppNavbar from "../AppNavbar";


function RegisterPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        axios
            .post("api/auth/register", {
                phone_number: phoneNumber,
                user_password: password,
            })
            .then((response) => {
                if (response.status === 204) {
                    alert("You are not Zlagoda's employee");
                } else if (response.status === 200) {
                    alert("You have registered successfully");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <AppNavbar />
            <Container>
                <h1>Registration</h1>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="phoneNumber">Phone Number</Label>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="confirmPassword">Confirm Password</Label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <button type="submit">Register</button>
                </Form>
            </Container>
        </div>
    );
}

export default RegisterPage;