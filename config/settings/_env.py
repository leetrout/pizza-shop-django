import os
from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.FileAwareEnv()
env.prefix = "PZA_"

env_file_path = str(BASE_DIR / ".env")

# OS environment variables take precedence over variables from .env
if os.path.exists(env_file_path):
    env.read_env(env_file_path)
