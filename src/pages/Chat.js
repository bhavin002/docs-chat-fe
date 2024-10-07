import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            setMessages([...messages, { text: inputMessage, sender: 'user' }]);
            setInputMessage('');
            // Simulate a response (you'd replace this with actual API call)
            setTimeout(() => {
                setMessages(prev => [...prev, { text: 'This is a simulated response.', sender: 'bot' }]);
            }, 1000);
        }
    };

    return (
        <>
            <Container fluid className="vh-100 d-flex flex-column">
                <Header />
                <Row className="flex-grow-1">
                    <Col md={3} className="bg-light p-3 d-none d-md-block">
                        <h5>Files</h5>
                        <ListGroup>
                            <ListGroup.Item action>Thread 1</ListGroup.Item>
                            <ListGroup.Item action>Thread 2</ListGroup.Item>
                            <ListGroup.Item action>Thread 3</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={9} className="d-flex flex-column p-0">
                        <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: 'calc(100vh - 70px)' }}>
                            <ListGroup>
                                {messages.map((message, index) => (
                                    <ListGroup.Item key={index} className={`border-0 ${message.sender === 'user' ? 'text-end' : ''}`}>
                                        <span className={`d-inline-block p-2 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                                            {message.text}
                                        </span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                        <div className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="d-flex">
                                    <Form.Control
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Type your message..."
                                    />
                                    <Button type="submit" variant="primary" className="ms-2">Send</Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Chat;