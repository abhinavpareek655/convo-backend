import qrcode

# Sample QR Codes from MongoDB
qr_codes = ["2021IMSE021"]

for qr in qr_codes:
    qr_img = qrcode.make(qr)
    qr_img.save(f"{qr}.png")

print("QR Codes Generated!")
