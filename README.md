# Setup Instruction

## Clone the Repository

```sh
git clone https://github.com/yourusername/your-repo-name.git
```

### Front-End

- Install the dependencies:

  ```sh
  cd UI
  npm install
  ```

- Start the development server:

  ```sh
  npm start
  ```

- Build and run iOS and Android development builds:

  ```sh
  npm run ios
  # or
  npm run android
  ```

- In the terminal running the development server, press `i` to open the iOS simulator, `a` to open the Android device or emulator, or `w` to open the web browser.

### Back-End

- Create a .env file in the root directory and add the following variables:
  ```sh
  MONGODB_URL=your_mongodb_connection_string
  SECRET_KEY=your_secret_key
  AUTH_USER=your_email@example.com
  AUTH_PASS=your_email_password
  FROM=your_email@example.com
  PORT=your_preferred_port_number
  ```

- Install the dependencies:

  ```sh
  cd server
  npm install
  ```

- Start the development server:

  ```sh
  nodemon index.js
  ```
