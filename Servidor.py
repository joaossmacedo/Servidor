import socket

# abre o arquivo
arquivo = open('Game_Project.html', 'r')
# le o arquivo
pagina = arquivo.read()

# cria um objeto socket
# o soquete faz
soquete = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# imprime o socket algo do tipo <socket._socketobject object at 0x10070b600>
print(soquete)

# liga o socket a um endereco
HOST = '127.0.0.1'
PORTA = 8000
soquete.bind(('', PORTA))
# fica de olho para ver se eh feita alguma conexao com o socket
soquete.listen(5)

while True:
    # aceita a conexao(3-way handshake)
    # conexao eh o novo socket usado para receber e mandar dados na conexao
    # endereco eh o endereco ligado ao socket na outra ponta da conexao
    conexao, endereco = soquete.accept()
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
            # 220 quer dizer que a conexao deu certo
            # len(pagina) eh o tamanho do arquivo
            # pagina eh a propria pagina
            conexao.sendall('HTTP/1.0 200 OK\r\n' +
                            'Content-Type: text/html\r\n' +
                            'Content-Length: ' + str(len(pagina)) + '\r\n\r\n' +
                            pagina)
        else:
            # ext eh a extensao do arquivo(por exemplo: .gif, .)
            ext = dataParse[1].rpartition(".")[-1]
            # abre o arquivo(imagem)
            f = open(dataParse[1][1:], 'r')
            # le o arquivo(imagem)
            figura = f.read()
            # 220 quer dizer que a conexao deu certo
            # len(figura) eh o tamanho do arquivo
            # figura eh a propria figura
            conexao.sendall('HTTP/1.0 200 OK\r\n' +
                            'Content-Type: image' + ext + '\r\n' +
                            'Content-Length: ' + str(len(figura)) + '\r\n\r\n' +
                            figura)

    print("")
    conexao.close()
soquete.close()