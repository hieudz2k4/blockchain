from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.exceptions import InvalidSignature


def load_private_key(filename="ecc_private.pem"):
    with open(filename, "rb") as f:
        return serialization.load_pem_private_key(f.read(), password=None)


def load_public_key(filename="ecc_public.pem"):
    with open(filename, "rb") as f:
        return serialization.load_pem_public_key(f.read())


def sign_message(private_key, message):
    signature = private_key.sign(message, ec.ECDSA(hashes.SHA256()))
    return signature


def verify_signature(public_key, message, signature):
    try:
        public_key.verify(signature, message, ec.ECDSA(hashes.SHA256()))
        print("Chữ ký hợp lệ!")
    except InvalidSignature:
        print("Chữ ký không hợp lệ!")


message = b"Hello ECC"

private_key = load_private_key()
public_key = load_public_key()

signature = sign_message(private_key, message)
print("Chữ ký (hex):", signature.hex())

verify_signature(public_key, message, signature)
