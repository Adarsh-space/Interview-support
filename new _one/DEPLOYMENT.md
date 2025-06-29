# 🚀 Deployment Guide - Interview AI Platform

This guide provides step-by-step instructions for deploying the Interview AI Platform to production.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Database**: PostgreSQL 13+ or MongoDB 4.4+
- **Redis**: 6.x or higher (for caching and sessions)
- **Storage**: Cloud storage (AWS S3, Google Cloud Storage, or Azure Blob)
- **SSL Certificate**: For HTTPS
- **Domain**: Custom domain for production

### Cloud Platform Options
- **AWS**: EC2, ECS, or Lambda
- **Google Cloud**: Compute Engine, Cloud Run, or App Engine
- **Azure**: App Service or Container Instances
- **DigitalOcean**: Droplets or App Platform
- **Heroku**: Platform as a Service
- **Vercel**: Frontend deployment
- **Netlify**: Frontend deployment

## 🔧 Environment Setup

### 1. Environment Variables

Create `.env` files for both frontend and backend:

#### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com

# AI Services
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_GOOGLE_CLOUD_CREDENTIALS=your_google_credentials

# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
REACT_APP_MIXPANEL_TOKEN=your_mixpanel_token

# Feature Flags
REACT_APP_ENABLE_VIDEO_CALLS=true
REACT_APP_ENABLE_SCREEN_SHARING=true
REACT_APP_ENABLE_RECORDING=true

# Security
REACT_APP_ENABLE_2FA=true
REACT_APP_SESSION_TIMEOUT=3600
```

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:port/database
MONGODB_URI=mongodb://user:password@host:port/database

# Redis
REDIS_URL=redis://user:password@host:port

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# AI Services
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_CREDENTIALS=your_google_credentials
GOOGLE_CLOUD_PROJECT_ID=your_project_id

# File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
```

### 2. Database Setup

#### PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE interview_platform;

-- Create user
CREATE USER interview_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE interview_platform TO interview_user;

-- Create tables (if using Sequelize, this will be automatic)
```

#### MongoDB Setup
```javascript
// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### 3. Redis Setup
```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Set password
requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis
```

## 🐳 Docker Deployment

### 1. Frontend Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Backend Dockerfile
```dockerfile
# Backend Dockerfile
FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:3001

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/interview_platform
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: interview_platform
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    command: redis-server --requirepass password
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. EC2 Setup
```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. ECS Deployment
```json
// task-definition.json
{
  "family": "interview-platform",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-registry/interview-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/interview-platform",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Deployment

#### 1. Cloud Run
```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/interview-platform

# Deploy to Cloud Run
gcloud run deploy interview-platform \
  --image gcr.io/PROJECT_ID/interview-platform \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

#### 2. App Engine
```yaml
# app.yaml
runtime: nodejs16
env: standard

instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

env_variables:
  NODE_ENV: production
  DATABASE_URL: "your_database_url"

handlers:
  - url: /.*
    script: auto
    secure: always
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 2. Security Headers
```javascript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 3. Rate Limiting
```javascript
// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

## 📊 Monitoring & Logging

### 1. Application Monitoring
```javascript
// Winston logger configuration
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'interview-platform' },
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});
```

### 2. Health Checks
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    // Check Redis connection
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: interview-platform
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster interview-cluster --service interview-service --force-new-deployment
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);
```

### 2. Caching Strategy
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache session data
const cacheSession = async (sessionId, data) => {
  await client.setex(`session:${sessionId}`, 3600, JSON.stringify(data));
};

// Cache AI responses
const cacheAIResponse = async (key, response) => {
  await client.setex(`ai:${key}`, 1800, JSON.stringify(response));
};
```

### 3. CDN Configuration
```javascript
// Static file serving with CDN
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));
```

## 🚨 Troubleshooting

### Common Issues

1. **WebSocket Connection Issues**
   ```javascript
   // Check WebSocket connection
   socket.on('connect_error', (error) => {
     console.error('Socket connection error:', error);
   });
   ```

2. **Database Connection Issues**
   ```javascript
   // Database connection retry
   const connectWithRetry = async () => {
     try {
       await sequelize.authenticate();
       console.log('Database connected successfully');
     } catch (error) {
       console.error('Database connection failed:', error);
       setTimeout(connectWithRetry, 5000);
     }
   };
   ```

3. **Memory Leaks**
   ```javascript
   // Monitor memory usage
   setInterval(() => {
     const memUsage = process.memoryUsage();
     console.log('Memory usage:', memUsage);
   }, 30000);
   ```

### Performance Monitoring
```javascript
// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});
```

## 📞 Support

For deployment support:
- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Email**: support@yourdomain.com
- **Slack**: [Community Channel](link-to-slack)

---

**Happy Deploying! 🚀** 