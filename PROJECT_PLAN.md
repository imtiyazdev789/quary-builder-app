# Query App - Mobile Development Plan

## Project Overview

Mobile application for connecting clients with construction/architecture professionals.

---

## ✅ Completed Features

### Authentication & Navigation

- [x] Client Login/Registration with email verification
- [x] JWT session management with AsyncStorage
- [x] Role-based navigation (Client, Professional, Admin shells)
- [x] Password reset flow (request → OTP → email link)
- [x] Custom UI components (CustomAlert, CustomButton)
- [x] Inline form validation with error messages
- [x] Show/hide password toggle
- [x] Logout functionality in drawers
- [x] Demo mode for client preview

---

## 📋 Pending Features

### 1. Client Extended Signup

**Status:** Pending

Add additional fields to client registration:

- Full name
- Phone number
- Profile photo (image picker)
- Address (line1, line2)
- City, State, Pincode

**Dependencies:**

- `expo-image-picker` for profile photo

---

### 2. Professional Multi-Step Registration

**Status:** Pending

Multi-step form with document uploads:

| Step               | Fields                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| 1. Business Info   | businessName, businessType, category, dateOfEstablishment                  |
| 2. Location        | state, district, city, pincode, registeredAddress                          |
| 3. Company Contact | companyEmail, companyPhone, whatsappNumber, websiteUrl                     |
| 4. Representative  | representativeName, designation, representativeMobile, representativeEmail |
| 5. KYC & Documents | kycIdType, kycIdDocument (file), logo (file), conditional docs             |
| 6. About Business  | shortDescription (100-150 words), detailedDescription, services[]          |
| 7. Review & Submit | declarationAccepted, password, confirmPassword                             |

**Required Documents:**

- KYC Document (Aadhaar/PAN/VoterID/Passport) - **Required**
- Logo - **Required**
- Company Registration Doc - Required for Partnership/LLP or Company
- COA Registration Doc - Required for Architecture Consultant
- Structural Registration Doc - Required for Structural Consultant
- Construction License Doc - Required for Contractor

**Dependencies:**

- `expo-image-picker` for logo/photos
- `expo-document-picker` for PDFs

---

### 3. Client Features

#### 3.1 Create Service Requests/Projects

- Project title and description
- Category selection
- Budget range
- Timeline/deadline
- Location of project

#### 3.2 Upload Attachments

- Images (floor plans, site photos)
- Drawings (CAD files, PDFs)
- Documents (requirements, specifications)

#### 3.3 Browse Professional Profiles

- List view with filters
- Professional detail page
- Portfolio gallery
- Reviews and ratings

#### 3.4 Request Quotations

- Select professional
- Describe requirements
- Submit quotation request
- Track quotation status

#### 3.5 Track Project Status

- Project timeline view
- Status updates
- History of interactions

---

### 4. Professional Features

#### 4.1 Manage Profile & Portfolio

- Edit business information
- Update services offered
- Add/edit portfolio projects
- Upload project images

#### 4.2 Accept/Reject Project Requests

- View incoming requests
- Accept or decline
- Add notes/comments

#### 4.3 Share Quotations

- Create quotation
- Itemized pricing
- Terms and conditions
- Send to client

---

### 5. Geolocation & Map Integration

**Status:** Pending

Find nearby professionals based on distance:

**Features:**

- Map view with professional markers
- Distance-based filter options:
  - 1 km
  - 5 km
  - 10 km
  - 25 km
  - 50 km
  - 100 km
- Category filter on map
- Current location detection
- Search by area/city

**Dependencies:**

- `expo-location` for GPS
- `react-native-maps` for map display

---

### 6. Push Notifications (Firebase)

**Status:** Pending

- New project request notifications
- Quotation received/accepted
- Status update alerts
- Promotional notifications

**Dependencies:**

- `expo-notifications`
- Firebase Cloud Messaging setup

---

## ❌ Out of Scope (Current Phase)

| Feature                    | Reason                         |
| -------------------------- | ------------------------------ |
| Real-time Chat             | Complex Socket.io integration  |
| Payment Gateway (Razorpay) | Requires backend payment setup |
| Admin Mobile Features      | Admin uses web dashboard       |
| Biometric Authentication   | Nice-to-have, not essential    |

---

## Tech Stack

| Category      | Technology                             |
| ------------- | -------------------------------------- |
| Framework     | React Native + Expo                    |
| Navigation    | React Navigation (Stack, Drawer, Tabs) |
| Styling       | NativeWind (Tailwind CSS)              |
| State         | React Context + Zustand                |
| HTTP          | Axios                                  |
| Storage       | AsyncStorage                           |
| Maps          | react-native-maps                      |
| Location      | expo-location                          |
| Images        | expo-image-picker                      |
| Documents     | expo-document-picker                   |
| Notifications | expo-notifications + Firebase          |

---

## Development Timeline (Estimated)

| Week   | Features                                              |
| ------ | ----------------------------------------------------- |
| Week 1 | ✅ Auth, Navigation, Password Reset (DONE)            |
| Week 2 | Client extended signup, Professional registration     |
| Week 3 | Client features (requests, uploads, browse)           |
| Week 4 | Professional features (profile, requests, quotations) |
| Week 5 | Geolocation, Map integration                          |
| Week 6 | Push notifications, Testing, Polish                   |

---

## API Endpoints Reference

Base URL: `http://<network-ip>:5000`

---

### 🔐 Authentication (`/userauth` & `/auth`)

| Method | Endpoint                         | Description                                                                    | Auth |
| ------ | -------------------------------- | ------------------------------------------------------------------------------ | ---- |
| POST   | `/userauth/user/register`        | Client registration (firstName, lastName, email, password, role, mobileNumber) | ❌   |
| POST   | `/userauth/user/login`           | Client & Professional login (email, password, role)                            | ❌   |
| POST   | `/auth/professional/newregister` | Professional registration with documents (multipart/form-data)                 | ❌   |
| POST   | `/auth/verifiyotp`               | Verify email OTP (email, otp, emailVerificationId, role)                       | ❌   |
| POST   | `/auth/resendotp`                | Resend OTP (email, emailVerificationId, role)                                  | ❌   |
| POST   | `/auth/otpstatus`                | Check OTP status                                                               | ❌   |

---

### 🔑 Password Reset (`/auth`)

| Method | Endpoint                                 | Description                                     | Auth |
| ------ | ---------------------------------------- | ----------------------------------------------- | ---- |
| POST   | `/auth/forget-password/otp-verification` | Request password reset OTP (email, role)        | ❌   |
| POST   | `/auth/forget-password/verify-otp`       | Verify password reset OTP                       | ❌   |
| POST   | `/auth/forget-password/resend-otp`       | Resend password reset OTP                       | ❌   |
| POST   | `/auth/forget-password`                  | Set new password (requires JWT from email link) | ✅   |

---

### 👤 User Profile (`/user`)

| Method | Endpoint                       | Description                             | Auth      |
| ------ | ------------------------------ | --------------------------------------- | --------- |
| GET    | `/user/profile`                | Get logged-in user/professional profile | ✅        |
| GET    | `/user/getuserdashboarddetail` | Get client dashboard stats              | ✅ Client |

---

### 🏢 Professional (`/professional` & `/api`)

| Method | Endpoint                       | Description                             | Auth            |
| ------ | ------------------------------ | --------------------------------------- | --------------- |
| GET    | `/professional/list`           | List all professionals (public)         | ❌              |
| GET    | `/professional/nearby`         | Get nearby professionals by location    | ❌              |
| GET    | `/professional/radius-options` | Get available radius filter options     | ❌              |
| GET    | `/professional/dashboard/info` | Professional dashboard stats            | ✅ Professional |
| GET    | `/api/professionaldetails/:id` | Get professional profile by ID (public) | ❌              |
| GET    | `/api/professionaldetails`     | Get own professional profile            | ✅              |
| PATCH  | `/api/updateprofprofile`       | Update professional profile (multipart) | ✅              |
| DELETE | `/api/delete`                  | Delete professional account             | ✅              |

---

### 📋 Service Requests (`/request`)

| Method | Endpoint                    | Description                           | Auth            |
| ------ | --------------------------- | ------------------------------------- | --------------- |
| POST   | `/request/client`           | Create new service request            | ❌              |
| GET    | `/request/list`             | Get requests for professional         | ✅ Professional |
| PATCH  | `/request/updatestatus/:id` | Update request status (accept/reject) | ✅ Professional |
| GET    | `/request/clientrequests`   | Get client's own requests             | ✅ Client       |

---

### 🖼️ Portfolio (`/portfolio`)

| Method | Endpoint                     | Description                       | Auth            |
| ------ | ---------------------------- | --------------------------------- | --------------- |
| POST   | `/portfolio/createportfolio` | Create portfolio item (multipart) | ✅ Professional |
| GET    | `/portfolio/fetchportfolios` | Get professional's portfolios     | ✅ Professional |

---

### 📁 Projects (`/profes`)

| Method | Endpoint                            | Description                                          | Auth            |
| ------ | ----------------------------------- | ---------------------------------------------------- | --------------- |
| POST   | `/profes/createproject`             | Create project (multipart, up to 5 images per field) | ✅ Professional |
| GET    | `/profes/fetchprojects`             | Get professional's projects                          | ✅ Professional |
| GET    | `/profes/fetchprojectdetails/:id`   | Get project details (public)                         | ❌              |
| GET    | `/profes/fetch-unpublished-project` | Get unpublished projects                             | ❌              |
| DELETE | `/profes/deleteproject/:id`         | Delete project                                       | ✅ Professional |

---

### ⭐ Reviews (`/api`)

| Method | Endpoint                      | Description                    | Auth            |
| ------ | ----------------------------- | ------------------------------ | --------------- |
| POST   | `/api/createreview`           | Create review for professional | ❌              |
| GET    | `/api/getprofessionalreviews` | Get reviews for professional   | ✅ Professional |

---

### 👥 User & Professional Common (`/api`)

| Method | Endpoint                  | Description                      | Auth |
| ------ | ------------------------- | -------------------------------- | ---- |
| PATCH  | `/api/user/updateprofile` | Update user/professional profile | ✅   |

---

### 🛡️ Admin (`/admin`)

| Method | Endpoint                                      | Description                      | Auth |
| ------ | --------------------------------------------- | -------------------------------- | ---- |
| POST   | `/admin/login`                                | Admin login (username, password) | ❌   |
| GET    | `/admin/dashboarddetails`                     | Get admin dashboard counts       | ❌   |
| GET    | `/admin/clientDetails`                        | Get all clients                  | ❌   |
| GET    | `/admin/prof/details`                         | Get all professionals            | ❌   |
| GET    | `/admin/prof/indetails/:professionalId`       | Get professional full details    | ❌   |
| POST   | `/admin/prof/updatestatus/:id`                | Approve/reject professional      | ❌   |
| GET    | `/admin/prof/project/details/:professionalId` | Get professional's projects      | ❌   |
| POST   | `/admin/prof/project/verification/:projectId` | Approve/reject project           | ❌   |

---

### 📤 Static Files

| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| GET    | `/uploads/*`     | Access uploaded files                  |
| GET    | `/api/uploads/*` | Access uploaded files (alternate path) |

---

### 📝 Request Body Examples

#### Client Registration

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "mobileNumber": "9876543210"
}
```

#### Login (Client/Professional)

```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "professional"
}
```

#### Admin Login

```json
{
  "username": "admin123",
  "password": "admin123"
}
```

#### Verify OTP

```json
{
  "email": "john@example.com",
  "otp": "123456",
  "emailVerificationId": "uuid-from-registration",
  "role": "user"
}
```

#### Create Service Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "projectType": "Residential",
  "description": "Need architect for home design",
  "location": "Mumbai",
  "budget": "10-20 Lakhs"
}
```

#### Get Nearby Professionals (Query Params)

```
GET /professional/nearby?lat=19.0760&lng=72.8777&radius=10&category=ArchitectureConsultant&page=1&limit=20
```

| Param    | Type   | Description                       | Required |
| -------- | ------ | --------------------------------- | -------- |
| lat      | number | Latitude of user's location       | ✅       |
| lng      | number | Longitude of user's location      | ✅       |
| radius   | number | Search radius in km (default: 10) | ❌       |
| category | string | Filter by professional category   | ❌       |
| page     | number | Page number for pagination        | ❌       |
| limit    | number | Items per page (default: 20)      | ❌       |

#### Location Data Format (GeoJSON)

```json
{
  "location": {
    "type": "Point",
    "coordinates": [72.8777, 19.076] // [longitude, latitude]
  },
  "formattedAddress": "123 Main Street, Andheri West, Mumbai, Maharashtra 400053"
}
```

**Note:** MongoDB uses `[longitude, latitude]` order (not `[lat, lng]`)

---

## Notes

- Backend is already built and running on port 5000
- API base URL configured via `.env` file
- Professional registration requires multipart/form-data for file uploads
- All authenticated routes require JWT token in Authorization header

---

_Last Updated: December 14, 2025_
