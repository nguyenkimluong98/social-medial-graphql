import React, { useState, useContext } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../contexts/auth";

const Register = (props) => {
	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState({
		username: false,
		email: false,
		password: false,
		confirmPassword: false,
		passwordNotMatch: false,
		graphqlError: {},
	});

	const context = useContext(AuthContext);

	const [addUser, { loading }] = useMutation(REGISTER_USER);

	const onChange = (e) => {
		const targetName = e.target.name;

		if (["confirmPassword", "password"].includes(targetName)) {
			setErrors({ ...errors, [targetName]: false, passwordNotMatch: false });
		} else {
			setErrors({ ...errors, [targetName]: false });
		}

		setValues({ ...values, [targetName]: e.target.value });
	};

	const validateForm = () => {
		let isError = false;
		const errorFields = { ...errors };

		Object.keys(values).forEach((key) => {
			if (!values[key]) {
				errorFields[key] = true;
				isError = true;
			}
		});

		if (!isValidEmail(errorFields)) {
			errorFields.email = true;
			isError = true;
		}

		if (!isConfirmPasswordMatched(errorFields)) {
			errorFields.passwordNotMatch = true;
			isError = true;
		}

		return [isError, errorFields];
	};

	const isValidEmail = (errorFields) => {
		return !errorFields.email && EMAIL_REGEX.test(values.email);
	};

	const isConfirmPasswordMatched = (errorFields) => {
		return (
			!errorFields.password &&
			!errorFields.confirmPassword &&
			values.password === values.confirmPassword
		);
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		const [isError, errorFields] = validateForm();

		if (isError) {
			setErrors(errorFields);
			return;
		}

		try {
			const data = await addUser({ variables: values });

			values.username = "hellloooo";

			context.login(data.data.register);

			props.history.push("/");
		} catch (err) {
			setErrors({
				...errors,
				graphqlError:
					err.graphQLErrors.length && err.graphQLErrors[0].extensions.errors,
			});
		}
	};

	return (
		<div className="form-container">
			<Form className={loading ? "loading" : ""} onSubmit={onSubmit} noValidate>
				<h1 className="page-title">Register</h1>
				<Form.Input
					label="Username"
					type="text"
					placeholder="Enter your username"
					name="username"
					value={values.username}
					onChange={onChange}
					error={
						errors.username && {
							content: "Please enter your username",
							pointing: "below",
						}
					}
					required
				/>
				<Form.Input
					label="Email"
					type="email"
					placeholder="Enter your email"
					name="email"
					value={values.email}
					onChange={onChange}
					required
					error={
						errors.email && {
							content: "Please enter your valid email",
							pointing: "below",
						}
					}
				/>
				<Form.Input
					label="Password"
					type="password"
					placeholder="Enter your password"
					name="password"
					value={values.password}
					onChange={onChange}
					required
					error={
						errors.password && {
							content: "Please enter your password",
							pointing: "below",
						}
					}
				/>
				<Form.Input
					label="Confirm password"
					type="password"
					placeholder="Enter your password again"
					name="confirmPassword"
					value={values.confirmPassword}
					onChange={onChange}
					required
					error={
						(errors.confirmPassword || errors.passwordNotMatch) && {
							content: errors.passwordNotMatch
								? "Confirm password not match"
								: "Please enter your confirm password",
							pointing: "below",
						}
					}
				/>
				<Button type="submit" primary fluid>
					Register
				</Button>
			</Form>

			{Object.keys(errors.graphqlError).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors.graphqlError).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

const REGISTER_USER = gql`
	mutation Register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			token
			createdAt
		}
	}
`;

const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;

export default Register;
