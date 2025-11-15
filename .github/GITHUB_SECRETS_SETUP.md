# GitHub Secrets Setup Guide

## 📝 Frontend Build için Gerekli Secrets

GitHub Actions workflow'unda frontend build'i için aşağıdaki secrets'ları GitHub repository'nize eklemeniz gerekiyor:

### 1. GitHub Repository Secrets Ekleme

1. GitHub repository'nize gidin
2. **Settings** → **Secrets and variables** → **Actions** sekmesine gidin
3. **New repository secret** butonuna tıklayın
4. Her bir secret için aşağıdaki adımları tekrarlayın:

### 2. Gerekli Secrets Listesi

#### `VITE_API_URL`
- **Açıklama**: Backend API URL'i
- **Örnek Değer**: `https://api.yourdomain.com`
- **Production Değer**: Production backend URL'iniz

#### `VITE_WS_URL`
- **Açıklama**: WebSocket URL'i (genellikle API URL ile aynı, ws:// veya wss:// prefix ile)
- **Örnek Değer**: `wss://api.yourdomain.com`
- **Production Değer**: Production WebSocket URL'iniz

#### `VITE_CONTRACT_ADDRESS`
- **Açıklama**: Deployed smart contract address
- **Örnek Değer**: `0x3A895aeA91388f6b44227CDb565FDb04a8A81C79`
- **Production Değer**: Mainnet contract address'iniz

#### `VITE_CHAIN_ID`
- **Açıklama**: Blockchain Chain ID (hex format)
- **Örnek Değer**: `0x2B74` (Abstract Testnet) veya `0xAB5` (Abstract Mainnet)
- **Production Değer**: Production chain ID'niz

#### `VITE_WALLETCONNECT_PROJECT_ID`
- **Açıklama**: WalletConnect Project ID (https://cloud.walletconnect.com'dan alınır)
- **Örnek Değer**: `4fa1d964ec5302ec1801f47c61b39b7d`
- **Nasıl Alınır**:
  1. https://cloud.walletconnect.com adresine gidin
  2. Login olun veya hesap oluşturun
  3. Yeni bir project oluşturun
  4. Project ID'yi kopyalayın

### 3. Secrets Ekleme Adımları

Her secret için:

1. **Name**: Secret adını girin (örn: `VITE_WALLETCONNECT_PROJECT_ID`)
2. **Secret**: Değeri girin
3. **Add secret** butonuna tıklayın

### 4. Örnek Secret Ekleme

```
Name: VITE_WALLETCONNECT_PROJECT_ID
Secret: 4fa1d964ec5302ec1801f47c61b39b7d
```

### 5. Workflow'da Kullanım

Secrets eklendikten sonra, `.github/workflows/release.yml` dosyasında otomatik olarak kullanılacaktır:

```yaml
- name: Build and push Frontend
  run: |
    docker build \
      --build-arg VITE_WALLETCONNECT_PROJECT_ID=${{ secrets.VITE_WALLETCONNECT_PROJECT_ID }} \
      ...
```

### 6. Test Etme

1. Yeni bir release oluşturun
2. GitHub Actions workflow'unun çalıştığını kontrol edin
3. Build loglarında environment variable'ların geçtiğini doğrulayın
4. Deployed frontend'de değerlerin doğru olduğunu kontrol edin

### 7. Güvenlik Notları

- ✅ Secrets asla log'larda görünmez
- ✅ Sadece repository admin'leri secrets'ları görebilir
- ✅ Secrets workflow'lar tarafından kullanılabilir
- ✅ Secrets'ları asla kod içinde hardcode etmeyin

### 8. Troubleshooting

#### Secret görünmüyor
- Repository Settings → Secrets → Actions kontrol edin
- Secret adının tam olarak eşleştiğinden emin olun (büyük/küçük harf duyarlı)

#### Build sırasında undefined
- Dockerfile'da ARG ve ENV tanımlarını kontrol edin
- Workflow'da `--build-arg` parametrelerini kontrol edin
- Secret adlarının doğru olduğundan emin olun

#### Production'da değerler yanlış
- Secret değerlerini kontrol edin
- Build loglarını kontrol edin (değerler görünmez ama build başarılı olmalı)
- Deployed container'da environment variable'ları kontrol edin

## 📚 Kaynaklar

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker Build Args](https://docs.docker.com/engine/reference/commandline/build/#build-arg)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

