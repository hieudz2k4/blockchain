from Crypto.Cipher import AES
from Crypto.Hash import MD5


def evp_bytes_to_key(password: bytes, salt: bytes, key_len: int, iv_len: int):
    dtot = b""
    d = b""
    while len(dtot) < key_len + iv_len:
        d = MD5.new(d + password + salt).digest()
        dtot += d
    return dtot[:key_len], dtot[key_len : key_len + iv_len]


def decrypt_file(input_file: str, output_file: str, password: str):
    with open(input_file, "rb") as f:
        file_data = f.read()

    if file_data.startswith(b"Salted__"):
        salt = file_data[8:16]
        ciphertext = file_data[16:]
    else:
        raise ValueError("File không có header 'Salted__'.")

    key, iv = evp_bytes_to_key(password.encode("utf-8"), salt, key_len=32, iv_len=16)

    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(ciphertext)

    pad_len = decrypted[-1]
    if pad_len < 1 or pad_len > 16:
        raise ValueError("Padding không hợp lệ!")
    decrypted = decrypted[:-pad_len]

    with open(output_file, "wb") as f:
        f.write(decrypted)

    print("Giải mã thành công, file lưu tại:", output_file)


if __name__ == "__main__":
    input_filename = "hello.txt.enc"  # File đã mã hóa bằng OpenSSL
    output_filename = "hello_decrypted_python.txt"  # File giải mã sẽ lưu ở đây
    user_password = "aaaaaa"  # Mật khẩu sử dụng khi mã hóa
    decrypt_file(input_filename, output_filename, user_password)
