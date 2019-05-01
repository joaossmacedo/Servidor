import socket

h = open('Game_Project.html', 'r')
homepage = h.read()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print(s)

PORT = 8000
s.bind(('', PORT))
s.listen(5)
#conn, addr = s.accept()

while True:
    print("")
    conn, addr = s.accept()
    data = conn.recv(2000)

    if 'GET' in data:
        print('\n', data)
        dataParse = data.split(' ')
        if dataParse[1] == '/':
            conn.sendall('HTTP/1.0 200 OK\r\n' +
                         'Content-Type: text/html\r\n' +
                         'Content-Length: ' + str(len(homepage)) + '\r\n\r\n' +
                          homepage)
        else:
            ext = dataParse[1].rpartition(".")[-1]
            f = open(dataParse[1][1:], 'r')
            figure = f.read()
            conn.sendall('HTTP/1.0 200 OK\r\n' +
                         'Content-Type: image' + ext + '\r\n' +
                         'Content-Length: ' + str(len(figure)) + '\r\n\r\n' +
                          figure)

    conn.close()
s.close()