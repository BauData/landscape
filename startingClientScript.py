#!/usr/bin/python
try:
  from selenium import webdriver
  from selenium.webdriver.common.by import By
  from selenium.webdriver.support.ui import Select
  from selenium.webdriver.common.keys import Keys
  from selenium.common.exceptions import NoSuchElementException
  from socketIO_client import SocketIO, BaseNamespace
  import time, os
except ImportError:
  print "You should install some modules like:\n"
  print "Selenium & socketIO_client\n"

###on_reponse#####################################################
def on_reponse(*args):
	print('*** Thanks to use this service ***', args)
	driver.close()
	driver.quit()
	socketIO.disconnect()

###Main##############################################################
os.system('clear')

print "\n\n*** Welcome to the automatic client script ***\n"

driver = webdriver.Firefox(executable_path=r'/usr/local/bin/geckodriver')
#driver.get("http://baudata.ddns.net:3000/gradient")
driver.get("http://192.168.1.45:3000/landscape")

class Namespace(BaseNamespace):

    def on_connect(self):
        print('[Connected]')

    def on_reconnect(self):
        print('[Reconnected]')

    def on_disconnect(self):
        print('[Disconnected]')


with SocketIO('http://192.168.1.45', 3000, Namespace) as socketIO:
    socketIO.on('closeMsg', on_reponse)
    socketIO.wait()



