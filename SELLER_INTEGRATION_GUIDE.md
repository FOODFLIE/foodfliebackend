# Seller Login & Registration - Frontend Integration Guide

Base URL: `http://localhost:5000/api/seller`

---

## 📱 Flow Overview

```
User enters phone → Send OTP → Verify OTP → Check isNewUser
                                              ↓
                                    isNewUser: true → Show Registration Form → Register
                                    isNewUser: false → Login Success → Dashboard
```

---

## 🔥 Step-by-Step Integration

### **STEP 1: Send OTP**

**Endpoint:** `POST /seller/send-otp`

**When to call:** When user enters phone number and clicks "Send OTP"

**Request:**
```javascript
fetch('http://localhost:5000/api/seller/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: "9876543210"
  })
})
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

**Frontend Action:**
- Show OTP input field
- Start 5-minute countdown timer
- Check server console for OTP (development only)

---

### **STEP 2: Verify OTP**

**Endpoint:** `POST /seller/verify-otp`

**When to call:** When user enters OTP and clicks "Verify"

**Request:**
```javascript
fetch('http://localhost:5000/api/seller/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: "9876543210",
    otp: "123456"
  })
})
```

**Response 1 - Existing User (Login Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "seller": {
    "id": 1,
    "name": "Owner Name",
    "store_name": "My Restaurant",
    "phone": "9876543210",
    "address": "123 Street",
    "area": "Downtown",
    "approved": true,
    "is_active": true
  },
  "isNewUser": false
}
```

**Frontend Action for Existing User:**
```javascript
if (response.isNewUser === false) {
  // Save token
  localStorage.setItem('sellerToken', response.token);
  localStorage.setItem('seller', JSON.stringify(response.seller));
  
  // Redirect to dashboard
  window.location.href = '/seller/dashboard';
}
```

**Response 2 - New User:**
```json
{
  "isNewUser": true
}
```

**Frontend Action for New User:**
```javascript
if (response.isNewUser === true) {
  // Show registration form
  showRegistrationForm();
  
  // Keep phone number for registration
  setPhoneNumber("9876543210");
}
```

---

### **STEP 3: Register (Only for New Users)**

**Endpoint:** `POST /seller/register`

**When to call:** When new user fills registration form and submits

**Request:**
```javascript
fetch('http://localhost:5000/api/seller/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: "9876543210",
    name: "Rajesh Kumar",
    store_name: "Kumar's Restaurant",
    address: "123 Main Street, Bangalore",
    area: "Koramangala",
    pan_number: "ABCDE1234F",
    gst_number: "29ABCDE1234F1Z5",
    fssai_number: "12345678901234",
    bank_account_holder_name: "Rajesh Kumar",
    bank_account_number: "1234567890123456",
    bank_ifsc: "SBIN0001234"
  })
})
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "seller": {
    "id": 1,
    "name": "Rajesh Kumar",
    "store_name": "Kumar's Restaurant",
    "phone": "9876543210",
    "address": "123 Main Street, Bangalore",
    "area": "Koramangala",
    "approved": false,
    "is_active": false
  }
}
```

**Frontend Action:**
```javascript
// Save token
localStorage.setItem('sellerToken', response.token);
localStorage.setItem('seller', JSON.stringify(response.seller));

// Show success message
alert('Registration successful! Your account is pending approval.');

// Redirect to dashboard
window.location.href = '/seller/dashboard';
```

---

## 🎨 Complete React/JavaScript Example

```javascript
// State management
const [phone, setPhone] = useState('');
const [otp, setOtp] = useState('');
const [showOtpInput, setShowOtpInput] = useState(false);
const [showRegistrationForm, setShowRegistrationForm] = useState(false);
const [formData, setFormData] = useState({});

// Step 1: Send OTP
const handleSendOTP = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/seller/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setShowOtpInput(true);
      alert('OTP sent successfully!');
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Error sending OTP');
  }
};

// Step 2: Verify OTP
const handleVerifyOTP = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/seller/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      if (data.isNewUser) {
        // Show registration form
        setShowRegistrationForm(true);
      } else {
        // Login success
        localStorage.setItem('sellerToken', data.token);
        localStorage.setItem('seller', JSON.stringify(data.seller));
        window.location.href = '/seller/dashboard';
      }
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Error verifying OTP');
  }
};

// Step 3: Register
const handleRegister = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/seller/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        ...formData
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('sellerToken', data.token);
      localStorage.setItem('seller', JSON.stringify(data.seller));
      alert('Registration successful!');
      window.location.href = '/seller/dashboard';
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Error registering');
  }
};
```

---

## 📋 Registration Form Fields

```javascript
const registrationFields = {
  // Personal Info
  name: "Owner Name",
  phone: "9876543210", // Auto-filled from OTP step
  
  // Business Info
  store_name: "Restaurant Name",
  address: "Full Address",
  area: "Area/Locality",
  
  // Documents
  pan_number: "ABCDE1234F",
  gst_number: "29ABCDE1234F1Z5",
  fssai_number: "12345678901234",
  
  // Bank Details
  bank_account_holder_name: "Account Holder Name",
  bank_account_number: "1234567890123456",
  bank_ifsc: "SBIN0001234"
};
```

---

## ✅ Validation Rules

```javascript
const validation = {
  phone: /^[6-9]\d{9}$/, // 10 digits starting with 6-9
  otp: /^\d{6}$/, // 6 digits
  pan_number: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // ABCDE1234F
  gst_number: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, // 15 chars
  fssai_number: /^\d{14}$/, // 14 digits
  bank_ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/ // SBIN0001234
};
```

---

## 🔐 Using Token for Protected Routes

After login/registration, use the token for authenticated requests:

```javascript
const token = localStorage.getItem('sellerToken');

fetch('http://localhost:5000/api/category/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: "Pizza",
    partner_id: seller.id
  })
});
```

---

## ⚠️ Error Handling

```javascript
// Common errors
{
  "message": "Invalid or expired OTP"
}

{
  "message": "Seller already exists"
}

{
  "message": "Seller not found. Please register first."
}
```

---

## 🎯 Quick Checklist

- [ ] Phone input with validation
- [ ] Send OTP button
- [ ] OTP input field (6 digits)
- [ ] Verify OTP button
- [ ] Registration form (hidden initially)
- [ ] All form fields with validation
- [ ] Token storage in localStorage
- [ ] Redirect to dashboard after success
- [ ] Error message display
- [ ] Loading states for buttons

---

## 🚀 Testing

1. Enter phone: `9876543210`
2. Click "Send OTP"
3. Check server console for OTP
4. Enter OTP and verify
5. If new user, fill registration form
6. Submit and check dashboard redirect
