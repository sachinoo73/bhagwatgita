# Render Deployment Guide for Bhagwat Gita API

## Overview
This guide explains how to deploy your updated Bhagwat Gita API to Render with the new data structure and migration capabilities.

## Prerequisites
- Render account with a Web Service
- MongoDB database (MongoDB Atlas recommended)
- Git repository with your updated code

## Step 1: Update Your Render Service Configuration

### Environment Variables
In your Render service dashboard, add these environment variables:

```bash
# Required Variables
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bhagwat_gita?retryWrites=true&w=majority

# Optional Variables
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RUN_MIGRATION=true
```

### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `npm run render-start`
- **Auto-Deploy**: Enable if you want automatic deployments

## Step 2: Deploy Your Updated Code

### Option A: Automatic Deployment (Recommended)
1. Push your changes to your Git repository
2. Render will automatically detect changes and deploy
3. Monitor the build logs for any errors

### Option B: Manual Deployment
1. In Render dashboard, click "Manual Deploy"
2. Choose "Clear build cache & deploy"
3. Monitor the build process

## Step 3: Run Data Migration

### First Deployment (with Migration)
1. Set `RUN_MIGRATION=true` in environment variables
2. Deploy your code
3. Check logs to ensure migration completed successfully
4. Set `RUN_MIGRATION=false` for subsequent deployments

### Migration Logs
Look for these messages in your Render logs:
```
Running data migration...
Starting data migration...
Found X verses to migrate
Migration completed!
Successfully migrated: X verses
```

## Step 4: Verify Deployment

### Test Health Endpoint
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "memory": {...},
  "database": "connected"
}
```

### Test Your Fixed Endpoint
```bash
curl https://your-app-name.onrender.com/api/verses/4/24
```

This should now return verse data instead of a 404 error.

## Step 5: Monitor and Troubleshoot

### Check Logs
- Monitor build logs for deployment issues
- Check runtime logs for application errors
- Look for MongoDB connection issues

### Common Issues and Solutions

#### 1. MongoDB Connection Failed
**Error**: `MongoDB connection error`
**Solution**: 
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure database user has proper permissions

#### 2. Migration Failed
**Error**: `Migration failed`
**Solution**:
- Check database connection
- Verify collection names
- Review migration script logs

#### 3. Port Already in Use
**Error**: `EADDRINUSE`
**Solution**: 
- Render automatically sets the correct port
- Ensure you're using `process.env.PORT`

#### 4. Memory Issues
**Error**: `JavaScript heap out of memory`
**Solution**:
- Increase Render service memory allocation
- Optimize migration script for large datasets

## Step 6: Post-Deployment

### Update Environment Variables
After successful migration:
1. Set `RUN_MIGRATION=false`
2. Redeploy to ensure migration doesn't run again

### Monitor Performance
- Check response times
- Monitor memory usage
- Watch for any new errors

### Update Frontend (if applicable)
- Update API base URL to new Render domain
- Test all endpoints
- Verify data structure changes

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `production` | Environment mode |
| `PORT` | Yes | `10000` | Server port (Render sets this) |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origins |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |
| `RUN_MIGRATION` | No | `false` | Run migration on startup |

## Security Considerations

### Production Settings
- `NODE_ENV=production` enables security headers
- Helmet.js provides security middleware
- Rate limiting prevents abuse
- CORS is configurable for your domain

### Database Security
- Use MongoDB Atlas with network restrictions
- Strong passwords for database users
- Enable MongoDB authentication
- Use connection string with authentication

## Performance Optimization

### Database
- Ensure proper indexes exist
- Monitor query performance
- Use connection pooling

### Application
- Enable compression for large responses
- Implement caching where appropriate
- Monitor memory usage

## Support

### Render Support
- Check Render documentation
- Contact Render support for platform issues

### Application Issues
- Review application logs
- Check MongoDB connection
- Verify environment variables

### Migration Issues
- Review migration script logs
- Check database permissions
- Verify data structure compatibility

## Next Steps

After successful deployment:
1. Test all API endpoints
2. Monitor application performance
3. Set up logging and monitoring
4. Consider implementing caching
5. Plan for scaling if needed
