# Invite Clinician Edge Function

This Supabase Edge Function handles inviting clinician users to the platform.

## What it does

1. **Receives** `email`, `name`, and `companyId` from the client
2. **Uses service role key** to call `auth.admin.inviteUserByEmail(email)`
   - This sends a magic link email to the user
   - Creates the user in `auth.users` table
3. **Takes the returned `user_id`** and inserts a row into `profiles` table with:
   - `user_id`
   - `name`
   - `role: 'clinician'`
   - `companyId`

## Prerequisites

Before deploying, make sure you have:

1. **Supabase CLI installed**:
   ```bash
   npm install -g supabase
   ```

2. **Supabase project linked**:
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Environment variables set in Supabase Dashboard**:
   - Go to your Supabase Dashboard → Settings → Edge Functions
   - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are available
   - These are automatically provided by Supabase

## Deploy

To deploy this edge function:

```bash
supabase functions deploy invite-clinician
```

## Test locally

To test the function locally:

```bash
# Start local Supabase
supabase start

# Serve the function
supabase functions serve invite-clinician

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/invite-clinician' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com","name":"Test User","companyId":"company-123"}'
```

## Usage in React

### Import the InviteClinicianButton component:

```jsx
import InviteClinicianButton from "components/InviteClinicianButton/InviteClinicianButton";
```

### Use in your employee table row:

```jsx
<InviteClinicianButton
  email={employee.email}
  name={employee.name}
  companyId={employee.companyId}
  onSuccess={(data) => {
    console.log("Invitation sent successfully:", data);
    // Optionally refresh the table or update UI
  }}
  onError={(error) => {
    console.error("Failed to send invitation:", error);
  }}
/>
```

## API Reference

### Request Body

```json
{
  "email": "clinician@example.com",
  "name": "John Doe",
  "companyId": "company-uuid"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Clinician invited successfully",
  "user": {
    "id": "user-uuid",
    "email": "clinician@example.com",
    "name": "John Doe",
    "role": "clinician",
    "companyId": "company-uuid"
  }
}
```

### Error Response (400/500)

```json
{
  "error": "Error message description"
}
```

## Security

- Uses Supabase Service Role Key for admin operations
- Only accessible via authenticated API calls
- CORS enabled for your application domain
- Input validation for required fields

## Troubleshooting

### "Missing required fields" error
- Ensure you're passing `email`, `name`, and `companyId` in the request body

### "Failed to invite user" error
- Check that the email is valid and not already registered
- Verify your Supabase email settings are configured
- Check Supabase logs: `supabase functions logs invite-clinician`

### "Failed to create profile" error
- Verify the `profiles` table exists with correct schema
- Check that the table has `user_id`, `name`, `role`, and `companyId` columns
- Ensure RLS policies allow service role to insert

## Database Schema

The `profiles` table should have at least these columns:

```sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  companyId TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to insert
CREATE POLICY "Service role can insert profiles"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);
```
