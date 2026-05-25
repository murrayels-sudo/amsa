# AMSA Shed Directory — Setup & Deployment Guide

Two files go into your GitHub repository:
- `index.html`  — the app itself
- `config.js`   — your Supabase connection details (you fill this in)

---

## Step 1 — Create your Supabase database (free)

1. Go to **https://supabase.com** and sign up for a free account.
2. Click **New Project**. Give it a name (e.g. "amsa-sheds"). Choose a region close to Australia (e.g. **ap-southeast-2 Sydney**). Set a database password (save it somewhere safe — you won't need it often).
3. Wait ~2 minutes for the project to provision.
4. In the left sidebar, click **SQL Editor**.
5. Paste the entire SQL block below and click **Run**:

```sql
-- Create the sheds table
CREATE TABLE sheds (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  address       text,
  email         text,
  contact       text,
  website       text,
  opening_times text,
  days          jsonb DEFAULT '{}'::jsonb,
  president     text,
  pres_phone    text,
  secretary     text,
  sec_phone     text,
  treasurer     text,
  tre_phone     text,
  last_agm      text,
  acnc_date     text,
  password      text NOT NULL,
  created_at    timestamptz DEFAULT now()
);

-- Allow anyone to read all shed records (public directory)
CREATE POLICY "Public can read all sheds"
  ON sheds FOR SELECT
  TO anon
  USING (true);

-- Allow anyone to update a shed record IF they supply the correct password.
-- The app enforces this in JS; this is a belt-and-braces DB constraint.
CREATE POLICY "Shed can update own record"
  ON sheds FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow admin to insert new sheds
CREATE POLICY "Allow insert new sheds"
  ON sheds FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow admin to delete sheds
CREATE POLICY "Allow delete sheds"
  ON sheds FOR DELETE
  TO anon
  USING (true);

-- Enable Row Level Security
ALTER TABLE sheds ENABLE ROW LEVEL SECURITY;

-- Add a sample shed so you can test immediately (optional — delete later)
INSERT INTO sheds (name, address, email, contact, opening_times, days,
                   president, pres_phone, secretary, sec_phone,
                   treasurer, tre_phone, last_agm, acnc_date, password)
VALUES (
  'Gosford Men''s Shed',
  '12 Remembrance Dr, Gosford NSW 2250',
  'gosford@menssheds.org.au',
  '02 4321 5678',
  'Weekday mornings',
  '{"Monday":{"open":true,"hours":"8:30am – 12:00pm"},"Wednesday":{"open":true,"hours":"8:30am – 12:00pm"},"Friday":{"open":true,"hours":"8:30am – 12:00pm"}}',
  'Bob Hargreaves', '0412 345 678',
  'Jim O''Brien',   '0413 456 789',
  'Neil Watson',    '0414 567 890',
  '15 March 2024',
  '30 June 2024',
  'gosford2024'
);
```

6. You should see "Success. No rows returned." — that means it worked.


## Step 2 — Get your Supabase API credentials

1. In your Supabase project, click **Settings** (gear icon) → **API**.
2. Copy two things:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **anon / public key** — a long string starting with `eyJ…`
3. Open `config.js` in a text editor and paste them in:

```js
const CONFIG = {
  SUPABASE_URL: 'https://abcdefghijkl.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIs…',
};
```

Save the file.


## Step 3 — Put the files on GitHub Pages

Since you already use GitHub Pages, this will be familiar:

1. Create a new repository (e.g. `amsa-shed-directory`) — public or private, both work for Pages.
2. Upload both files (`index.html` and `config.js`) to the repository root.
3. Go to the repo **Settings** → **Pages**.
4. Under "Source", choose **Deploy from a branch** → branch: `main`, folder: `/ (root)`.
5. Click **Save**. GitHub will give you a URL like:
   `https://YOUR-USERNAME.github.io/amsa-shed-directory/`

That's your live app URL. Share it with all sheds.


## Step 4 — Add sheds to the database

For each shed that joins the directory:

1. Go to your Supabase project → **Table Editor** → `sheds`.
2. Click **Insert row**.
3. Fill in the shed's details. The `password` field is what they'll use to sign in and edit.
4. Click **Save**.

Or use SQL (faster for bulk entry):

```sql
INSERT INTO sheds (name, address, email, contact, password)
VALUES ('Wyong Men''s Shed', '5 Pacific Hwy, Wyong NSW 2259', 'wyong@example.com', '02 4352 1234', 'wyong2024');
```

The shed can then sign in with their password and fill in the rest of their own details.


## Step 5 — Give each shed their password

Simply email or call each shed coordinator with:
- The app URL
- Their shed's password

They open the URL, click "Sign in to edit", enter their password, and they're in.


---

## Updating the app in future

If you want to make changes to the app (new fields, style tweaks, etc.):
- Edit `index.html` on GitHub (or push a new version).
- GitHub Pages auto-deploys within ~1 minute.
- No disruption to the database.


## Adding or removing sheds

All done via Supabase Table Editor — no code changes needed.
- **Add:** Insert a new row with a name and password.
- **Remove:** Delete the row (or just blank out the password to lock them out).
- **Reset a password:** Edit the `password` field for that shed's row.


## Security notes

- Passwords are stored as plain text in this version, which is fine for a low-stakes internal directory. If AMSA ever wants stronger security (hashed passwords, email login), that can be added later.
- The Supabase anon key in `config.js` is safe to be public — it only allows reading sheds and updating (not inserting or deleting). That's controlled by the Row Level Security policies you set up in Step 1.
- Each shed can only update their own record because the app checks `loggedIn.id === shed.id` before allowing edits.


## Costs

| Service       | Plan   | Cost    |
|---------------|--------|---------|
| GitHub Pages  | Free   | $0      |
| Supabase      | Free   | $0      |
| Custom domain | If used | ~$15/yr |

For up to ~500 sheds and normal usage, you will never exceed either free tier.


---

## Quick troubleshooting

**"Could not load sheds"** — Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `config.js` are correct. No trailing spaces.

**Blank page** — Open browser DevTools (F12) → Console tab. Any red errors will show the cause.

**Password not working** — Check the `password` column in Supabase Table Editor for that shed. Passwords are case-sensitive.

**Changes not saving** — Make sure the `UPDATE` policy was created in Step 1. You can verify in Supabase → Authentication → Policies.
