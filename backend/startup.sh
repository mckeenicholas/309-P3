#!/usr/bin/env bash
if [[ ${OS:-} = Windows_NT ]]; then
    echo 'error: Please Setup using Windows Subsystem for Linux'
    exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
    sudo apt install python3
    if ! command -v python3 >/dev/null 2>&1; then
        echo 'error: issue installing python3.'
        exit 1
    fi
fi

if ! command -v python3 -m venv >/dev/null 2>&1; then
    sudo apt install python3-venv
    if ! command -v python3 -m venv >/dev/null 2>&1; then
        echo 'error: issue installing python3-venv.'
        exit 1
    fi
fi

python3 -m venv venv

chmod +x venv/bin/activate
sh venv/bin/activate

python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

python3 manage.py makemigrations
python3 manage.py migrate
