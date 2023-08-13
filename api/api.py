import sys
import os

# Add the parent directory of src to the path
current_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '.'))
sys.path.append(current_dir)

from src.app import app

if __name__ == '__main__':
    app.run(debug=True)
