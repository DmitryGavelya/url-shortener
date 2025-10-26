import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://url-shortener.ru';
const DISPLAY_BASE_URL = 'https://url-shortener.ru';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [lenUrl, setLenUrl] = useState('auto');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShorten = async () => {
    setError('');
    setShortUrl('');
    setCopied(false);
    setIsLoading(true);

    const effectiveLen = lenUrl === 'auto' ? 6 : parseInt(lenUrl, 10);

    if (!originalUrl) {
      setError('Пожалуйста, введите URL');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, lenUrl: effectiveLen }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось сократить URL');
      }

      const data = await response.json();
      setShortUrl(`${DISPLAY_BASE_URL}/${data.shortCode}`);
    } catch (err) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-vh-100 bg-light">
        <Container className="py-5">
          {/* Header */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="display-4 fw-bold text-primary mb-3">
                URL Shortener
              </h1>
              <p className="lead text-muted">
                Создавайте короткие ссылки из длинных URL мгновенно
              </p>
            </Col>
          </Row>

          {/* Main Card */}
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                  <Form>
                    {/* URL Input */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark mb-3">
                        Введите ваш длинный URL
                      </Form.Label>
                      <Form.Control
                          type="url"
                          placeholder="https://example.com/очень/длинный/url/который/нужно/сократить"
                          value={originalUrl}
                          onChange={(e) => setOriginalUrl(e.target.value)}
                          size="lg"
                          className="py-3 border-2"
                      />
                    </Form.Group>

                    {/* Length Settings */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark mb-3">
                        Настройте длину короткого кода
                      </Form.Label>
                      <Form.Select
                          value={lenUrl}
                          onChange={(e) => setLenUrl(e.target.value)}
                          size="lg"
                          className="border-2"
                      >
                        <option value="auto">Автоматическая длина (рекомендуется)</option>
                        <option value="5">5 символов</option>
                        <option value="6">6 символов</option>
                        <option value="7">7 символов</option>
                        <option value="8">8 символов</option>
                        <option value="9">9 символов</option>
                        <option value="10">10 символов</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                      </Form.Text>
                    </Form.Group>

                    {/* Submit Button */}
                    <Button
                        variant="primary"
                        onClick={handleShorten}
                        disabled={isLoading || !originalUrl.trim()}
                        size="lg"
                        className="w-100 py-3 fw-semibold"
                    >
                      {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Создаём короткий URL...
                          </>
                      ) : (
                          <>
                            Сократить URL
                          </>
                      )}
                    </Button>
                  </Form>

                  {/* Error Message */}
                  {error && (
                      <Alert variant="danger" className="mt-4">
                        {error}
                      </Alert>
                  )}

                  {/* Success Result */}
                  {shortUrl && (
                      <div className="mt-4 pt-4 border-top">
                        <Alert variant="success" className="border-0 bg-success bg-opacity-10">
                          <div className="d-flex align-items-center mb-2">
                            <strong className="text-success">Ваш короткий URL готов!</strong>
                          </div>

                          <div className="bg-white rounded p-3 border">
                            <Row className="align-items-center">
                              <Col>
                                <a
                                    href={shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none fw-bold text-break"
                                >
                                  {shortUrl}
                                </a>
                              </Col>
                              <Col xs="auto">
                                <CopyToClipboard text={shortUrl} onCopy={() => setCopied(true)}>
                                  <Button
                                      variant={copied ? "success" : "outline-primary"}
                                      size="sm"
                                      className="ms-2"
                                  >
                                    {copied ? (
                                        <>
                                          Скопировано!
                                        </>
                                    ) : (
                                        <>
                                          Копировать
                                        </>
                                    )}
                                  </Button>
                                </CopyToClipboard>
                              </Col>
                            </Row>
                          </div>

                          <div className="mt-2 text-muted small">
                            Нажмите на ссылку для проверки или скопируйте, чтобы поделиться
                          </div>
                        </Alert>
                      </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Add Bootstrap Icons */}
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        />
      </div>
  );
}

export default App;