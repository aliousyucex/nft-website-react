- Backend için docker build alınacak
- github actions eklenecek
- Kullanılmayan, .env içerikleri değiştirilecek/silinecek.


- tutorial otomatik açılmasın, GameModeModal'ın altına ve walletActions divinin başına sonuna bir yere
- GameBoard içerisine "leave" butonu ekleyelim. Confirmation ile, free game'de kaybetmiş sayılacaksın diyelim ve session tokenı temizleyelim. Roomdan çıktığını bildirelim ve oyunu otomatik olarak, afk gibi handle edelim. Paid, free ve single oyun modlarının hepsi için geçerli.
-  Gösterdiğimiz hata mesajlarını düzenlememiz lazım. Single playerde afk olunca Both afk şeklinde uyarı gösteriyoruz. Sen afk olduğun için gibi düzeltmemiz lazım.
- Oyunumuz dikey telefon ekranları için düzgün hizalanmamış durumda.
- histroy modal'ı gameboard'a geri eklemeliyiz.
- console'a çok fazla sensetive bilgi basıyoruz. Bu logları atmayı bırakmamız lazım. Sadece gerektiğinde el ile manuel logging ekleyebiliriz.
- Create ve quick join modalları içerisinde, single player ise fiyat set edilememeli, butonlarda disable hale gelmeli.
- Wallet bağlantısı sonrası kullanıcının bulunduğu chain'i get etmeli daha sonra check etmeliyiz. Eğer istediğimiz ağda değil ise, ağı değiştirmesi için bir istek oluşturmamız gerekiyor.
- 

- Landing page'deki animasyon ve düz kart yerine, oyuna bir logo oluşturup, bunu kullanalım.
- Oyun için isim önerisi alınacak

