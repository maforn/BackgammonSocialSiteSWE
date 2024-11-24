# Server

## Documentation
FastAPI automatically provides interactive API documentation via Swagger UI, accessible at http://serveraddress:port/docs.

## Server Folder Structure

The `server` folder contains the backend code for the application. Below is a description of the key files and directories:

- **`core/`**: Contains core configurations and settings.
    - **`config.py`**: Configuration file for global variables and settings.
- **`routes/`**: Contains the route definitions for the API, organized by functionality.
    - **`__init__.py`**: Initializes the routes module and aggregates individual route modules.
- **`services/`**: Contains service modules for various functionalities.
- **`tests/`**: Contains test cases for the server.
    - **`conftest.py`**: Configuration for pytest fixtures.
- **`models/`**: Contains the data models used by the application.
- **`main.py`**: The entry point for the FastAPI application.
- **`requirements.txt`**: Lists the Python dependencies for the server.
- **`.env.example`**: Example environment variables file.

## Usage guidelines 

To manage dependency versions you should use Python virtual environments.

1. Create one with the following command (name it ``venv`` to use the current ``.gitignore`` configuration)
```sh
python3 -m venv venv
```

2. Activate the virtual environment

- On Windows:
    ```sh
    .\venv\Scripts\activate
    ```
- On macOS and Linux:
    ```sh
    source venv/bin/activate
    ```

3. Install the required dependencies
```sh
pip install -r requirements.txt
```

4. Install new packages as needed as usual
```sh
pip install <package-name>
```

5. Update the ``requirements.txt`` file with new dependencies
```sh
pip freeze > requirements.txt
```

6. To deactivate the environment
```sh
deactivate
```

## Testing

To test the server code you can use ``pytest``. Run the following command:

```sh
pytest -v
```

To generate an HTML code coverage report that can be opened in the browser:
```sh
pytest --cov --cov-report=xml:coverage.xml --cov-config=.coveragerc
```