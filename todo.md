- Oyunumuz dikey telefon ekranları için düzgün hizalanmamış durumda.
- Oyun için isim önerisi alınacak

- Play again tuşu geri gelsin
    - Add new state to room for tracking is just empty room or just players finished a new game.
    - Do not dispose room on gameFinish, mark the room as usage: played and do not clear "played" rooms for 15sec
    - When players click to play again, re-register the players to room.

- Single player oyuncudan sonra seçtiği için, son saniyede seçilirse, AI seçim yapamıyor ve afk olarak nitelendiriliyor.
    - Şu anda bulunan oyuncu seçtikten sonra AI seçsin logic'ini kaldıralım. 10 saniyelik timer başladıktan sonra, ilk 1 ila 5 saniye içerisinde rastgele bir sürede seçimini player'dan bağımsız şekilde yapsın.
- Create room ve quick join içerisinde, practice game tuşunu kaldıralım ve aşağıya bir divedir ile, practice bölümü oluşturup, single ve multiplayer seçenekleri oluşturalım (Bunlar hali hazırda var), Single seçildiyse fiyat girişi kapalı kalsın(Şu anda bu şekilde), practice bölümündeki Multiplayer seçildiyse, fiyat Free olsun fakat düzenlenebilir olsun. Düzenlenmez ise free, düzenlenir ise paid bir game oluşturulsun, katılınsın. (yapılan bütün checkler hala geçerli. Sadece UI değişikliği)
- Telefon ekranında oynarken dikey varyasyonda sorunlarımız var.
    - Kartlar 5 adet yanyana ekrana sığmıyor ve overflow'umuzda kapalı. bu yüzden tıklanamıyor.
        - Telefon boyutlarında, kartları daha da küçültelim ve yanyana koyma konusunu aşağıdaki gibi değiştirelim.
            - 5 Kart: Kartların 3'ü yukarıda, 2'si altta olacak şekilde wrap edelim.
            - 4 Kart: Kartınların 2'si yukarıda, 2'si altta olacak şekilde wrap edelim.
            - 3 Kart: Kartları ortalayıp hepsini yanyana koyalım.
            - 2 Kart: Kartları ortalayıp hepsini yanyana koyalım.
            - 1 Kart: Kartları ortalayıp hepsini yanyana koyalım.
    - History modalını göstermiyoruz. Fakat history'e bakmak isteyebilirler.
        - Telefon boyutlarındayken, history kısmı tıklayarak açılıp kapatılabilir bir modal haline gelsin
            - History için buton görelim
            - Tıklandığında açılsın.
            - Bir daha tıklandığında, ya da modal dışına tıklandığında kapansın.
    - Lobby ekranında action butonlarımız çift sayı olmadığı için, mobilde tutorial butonunu farklı yere taşımalıyız.








# Sonraki step
- INSANLARA TEST ETTIR OYNAT



# AZ ONCELIKLI
- Internet sitesindeki text'ler ve diger angarya duzeltmeler yapilmali, chain bilgiler degismeli
- Discord kaldirilmali
- Twitter duzenlenmeli

