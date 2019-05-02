import socket

# abre o arquivo
arquivo = open('Game_Project.html', 'r')
# le o arquivo
pagina = arquivo.read()

# cria um objeto socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# imprime o socket, algo do tipo <socket._socketobject object at 0x10070b600>
print(s)

# liga o socket a um endereco
HOST = '127.0.0.1'
PORTA = 8000
s.bind((HOST, PORTA))
# fica de olho para ver se eh feita alguma conexao com o socket
s.listen(5)

while True:
    # aceita a conexao(3-way handshake)
    # conexao eh o novo socket usado para receber e mandar dados na conexao
    # endereco eh o endereco ligado ao socket na outra ponta da conexao
    conexao, endereco = s.accept()
    print("\nConnected by: " + str(endereco[0]) + ":" + str(endereco[1]))
    # recebe a conexao com o socket
    # size eh o limite de dados a serem recebidos de uma vez
    size = 2000
    data = conexao.recv(size)

    if 'GET' in data:
        # print('\n', data)
        # divide os dados de acordo com os espacos
        dataParse = data.split(' ')

        dataPrint = data.split('\r\n')
        for i in range(len(dataPrint)):
            print(dataPrint[i])

        if dataParse[1] == '/':
            # 200 quer dizer que a conexao deu certo
            # len(pagina) eh o tamanho do arquivo
            # pagina eh a propria pagina
            conexao.sendall('HTTP/1.0 200 OK\r\n' +
                            'Content-Type: text/html\r\n' +
                            'Content-Length: ' + str(len(pagina)) + '\r\n\r\n' +
                            pagina)
        else:
            # para caso o usuario algum dado sem extensao, como passar localhost:8000/test
            if '.' not in dataParse[1]:
                print("ERROR: Data not available")
            else:
                # ext eh a extensao do arquivo(por exemplo: .gif ou .js)
                ext = dataParse[1].rpartition(".")[-1]

                # adequa o content_type ao tipo de extensao utilizado
                if ext == 'png' or ext == 'jpg' or ext == 'jpeg' or \
                        ext == 'gif' or ext == 'tiff':
                    content_type = "image"
                elif ext == 'js':
                    content_type = 'application'
                elif ext == 'css':
                    content_type = 'text'
                elif ext == 'mpeg':
                    content_type = 'audio'
                elif ext == 'mp4':
                    content_type = 'video'
                elif ext == 'form-data':
                    content_type = 'multipart'
                else:
                    # como application eh o tipo mais comum se nao for
                    # um tipo nao esperado trata como application
                    content_type = 'application'

                # o try eh necessario para o caso do arquivo ser inexistente
                try:
                    # abre o arquivo
                    f = open(dataParse[1][1:], 'r')
                    # le o arquivo
                    arq = f.read()
                    # 200 quer dizer que a conexao deu certo
                    # len(arq) eh o tamanho do arquivo
                    conexao.sendall('HTTP/1.0 200 OK\r\n' +
                                    'Content-Type: ' + content_type + ext + '\r\n' +
                                    'Content-Length: ' + str(len(arq)) + '\r\n\r\n' +
                                    arq)
                except Exception as error:
                    print("ERROR: Unable to open file")
                    print(error)
    print("")
    conexao.close()

# eh desnecessario fechar o soquete visto que o codigo seria inalcancavel
# devido ao While: True
