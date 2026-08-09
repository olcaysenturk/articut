# Codex / Claude Code Ana Promptu

Sen kıdemli bir Next.js, Shopify Headless Commerce ve ileri seviye web animasyonları uzmanısın.

Aşağıdaki Figma tasarımını ve projeye eklenecek referans videoyu kullanarak production kalitesinde, tek ürün satan bir e-ticaret sitesi geliştirmeni istiyorum.

## Figma Tasarımı

https://www.figma.com/design/cDnAz0x6OwC927w7MFAVkV/Articut-Website?node-id=0-1&m=dev&t=tiIrAKL5uzZuszbD-1

## Projenin amacı

Bu proje:

- Tek bir ana ürünün satılacağı özel bir e-ticaret sitesi olacak.
- Ön yüz Next.js ile geliştirilecek.
- Shopify yalnızca headless commerce altyapısı olarak kullanılacak.
- Ürün, fiyat, varyant, stok, indirim, sepet, checkout, sipariş ve müşteri işlemleri Shopify üzerinden yönetilecek.
- Shopify Liquid tema yapısı kullanılmayacak.
- Site yüksek görsel kaliteye ve çok sayıda animasyona sahip olacak.
- Figma görsel tasarımın ana referansı olacak.
- Referans video animasyonların ana referansı olacak.

## Çalışma yöntemi

Kod yazmaya başlamadan önce:

1. Mevcut repository yapısını tamamen incele.
2. Next.js sürümünü, package manager’ı, klasör düzenini, componentleri, stilleri ve mevcut bağımlılıkları tespit et.
3. Figma MCP erişimi varsa Figma tasarımını doğrudan incele.
4. Ana frame içerisindeki tüm sectionları, componentleri, renkleri, fontları, spacing değerlerini, görselleri, ikonları ve responsive davranışları çıkar.
5. Projeye eklenen referans videoyu baştan sona analiz et.
6. Videoyu section ve sahne bazında bölümlendir.
7. Figma tasarımıyla videodaki animasyonları eşleştir.
8. Mevcut projedeki kullanılabilir componentleri ve design tokenlarını yeniden kullan.
9. Kodlamaya başlamadan önce kısa bir uygulama planı ve değiştirilecek dosyaların listesini çıkar.
10. Ardından planı doğrudan uygula. Gereksiz onay isteme.

Figma’ya erişilemiyorsa bunu açıkça belirt.

Figma’ya erişemediğin durumda rastgele bir arayüz oluşturma. Mevcut ekran görüntüleri, assetler ve referans videonun desteklediği bilgiler üzerinden ilerle.

## Kullanılacak teknolojiler

Ana teknoloji seti:

- Next.js App Router
- React
- TypeScript
- Shopify Storefront GraphQL API
- Shopify Cart API
- `@shopify/storefront-api-client`
- Tailwind CSS
- CSS variables
- GSAP
- GSAP ScrollTrigger
- `@gsap/react`
- Motion for React
- Zustand
- Zod
- Next.js Server Actions veya Route Handlers
- Vitest
- React Testing Library
- Playwright
- Vercel
- Sentry

Gerekmediği sürece yeni ve ağır bağımlılıklar ekleme.

Redux kullanma.

Hydrogen kullanma.

Shopify Liquid tema geliştirme.

## Ana mimari

Projenin tamamını Client Component yapma.

Server Component olarak tutulması gereken bölümler:

- Sayfa layoutları
- Ürün bilgilerinin ilk yüklenmesi
- Ürün adı ve açıklaması
- Fiyatın ilk gösterimi
- Shopify ürün sorguları
- SEO metadata
- Structured data
- Statik içerikler
- Teknik özellikler
- SSS
- Footer
- Gizlilik, iade ve satış sözleşmesi sayfaları

Client Component olarak tutulması gereken bölümler:

- GSAP animasyonları
- ScrollTrigger timeline’ları
- Varyant seçimi
- Adet seçimi
- Sepete ekleme
- Hemen satın alma
- Cart drawer
- Mobil menü
- Slider ve carousel
- Modal ve accordion
- Kullanıcı etkileşimleri

Client boundary mümkün olduğunca aşağı seviyede tutulmalı.

Bir section içinde yalnızca animasyon veya kullanıcı etkileşimi gereken parça Client Component olmalı.

Ana sayfanın tamamına `use client` koyma.

## Shopify mimarisi

Shopify aşağıdaki işlemler için tek gerçek veri kaynağı olacak:

- Ürün adı
- Ürün açıklaması
- Ürün görselleri
- Ürün varyantları
- Fiyat
- Karşılaştırma fiyatı
- Stok
- İndirim
- Sepet
- Checkout
- Siparişler

Shopify Admin üzerinden yapılan değişiklikler ön yüze yansıtılmalı.

Storefront API bağlantısını merkezi ve tip güvenli kur.

Önerilen yapı:

```text
src/lib/shopify/
  client.ts
  fragments.ts
  types.ts
  queries/
  mutations/
```

Storefront API token’ını browser’a açık şekilde gönderme.

Private token veya Admin API anahtarlarını Client Component içinde kullanma.

Environment değişkenlerini Zod ile doğrula.

Gerekli environment değişkenleri:

```text
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_API_VERSION
SHOPIFY_PRODUCT_HANDLE
```

## Ürün yapısı

Site başlangıçta tek ürün satacak.

Ancak yapıyı yalnızca tek sabit ürün için kırılgan şekilde kurma.

Ürün Shopify product handle üzerinden çekilmeli.

Ürün aşağıdakileri desteklemeli:

- Birden fazla görsel
- Birden fazla varyant
- Renk veya seçenek seçimi
- Adet seçimi
- Stokta var veya yok durumu
- Normal fiyat
- İndirimli fiyat
- Karşılaştırma fiyatı
- Sepete ekleme
- Hemen satın alma
- Checkout yönlendirmesi

Shopify ürün ve varyant ID’lerini kod içine sabit yazma.

## Sepet akışı

Shopify Cart API kullan.

Gerekli işlemler:

- `cartCreate`
- `cartLinesAdd`
- `cartLinesUpdate`
- `cartLinesRemove`
- Cart sorgulama
- Checkout URL alma

Cart ID’yi güvenli bir HTTP-only cookie veya uygun server-side yöntemle sakla.

Sepet state’ini ikiye ayır:

Shopify:

- Ürünler
- Varyantlar
- Fiyatlar
- İndirimler
- Toplam tutar
- Checkout URL

Zustand:

- Cart drawer açık mı?
- İşlem loading durumunda mı?
- Hangi varyant seçildi?
- Optimistic UI durumu
- Hata mesajları

Zustand içinde fiyat veya stok hesaplama.

Kullanıcı “Hemen Satın Al” butonuna bastığında:

1. Gerekirse Shopify cart oluştur.
2. Seçili varyantı sepete ekle.
3. Checkout URL al.
4. Kullanıcıyı Shopify checkout ekranına yönlendir.

Kredi kartı bilgilerini Next.js tarafında işleme.

## Referans video analizi

Projeye eklenen referans videoyu baştan sona dikkatlice incele.

Figma:

- Görsel tasarım
- Ölçüler
- Typography
- Renkler
- Spacing
- Responsive yerleşim

için ana referanstır.

Video:

- Animasyon davranışları
- Scroll senaryosu
- Hareket yönleri
- Zamanlama
- Easing
- Geçiş sırası
- Pin davranışı
- Scrub davranışı
- Parallax miktarı

için ana referanstır.

Kod yazmadan önce video için section bazlı animasyon analizi oluştur.

Her animasyon için şunları çıkar:

- Section adı
- Animasyonu yapılan element
- Başlangıç durumu
- Bitiş durumu
- Tetikleyici türü
- Scroll, hover, click veya otomatik çalışma
- Başlangıç noktası
- Bitiş noktası
- Süre
- Delay
- Easing
- Hareket yönü
- Translate değeri
- Scale değeri
- Rotate değeri
- Opacity değeri
- Pin veya sticky ihtiyacı
- Scrub ihtiyacı
- Parallax oranı
- Elementlerin çalışma sırası
- Desktop davranışı
- Tablet davranışı
- Mobil davranışı
- Reduced motion alternatifi

Videodaki hareketleri yalnızca genel tahminle uygulama.

Videonun desteklemediği yeni animasyonlar ekleme.

Videoda net görülemeyen bir hareket varsa bunu belirt ve en sade davranışı kullan.

Video ile Figma çelişirse:

- Görsel tasarım için Figma’yı
- Hareket ve zamanlama için videoyu

öncelikli kabul et.

## Animasyon mimarisi

Animasyonları componentlerin içine plansız şekilde dağıtma.

Animasyonları section bazında izole et.

### GSAP ve ScrollTrigger

Şunlar için kullan:

- Scroll’a bağlı animasyonlar
- Pinned sectionlar
- Scrub animasyonlar
- Parallax
- Ürünün scroll sırasında hareket etmesi
- Görsellerin katmanlı hareketleri
- Uzun timeline animasyonları
- Yazıların sırayla ortaya çıkması
- Scroll ile ürün hikâyesi anlatımı
- Masaüstü ve mobil için farklı timeline’lar

### Motion for React

Şunlar için kullan:

- Cart drawer
- Modal
- Mobil menü
- Accordion
- Buton hover ve tap efektleri
- Varyant seçimi
- Küçük UI geçişleri
- Mount ve unmount animasyonları

### CSS

Şunlar için kullan:

- Basit hover
- Renk geçişleri
- Küçük opacity geçişleri
- Focus ve active durumları

GSAP ve Motion aynı elementin `transform` değerini aynı anda yönetmemeli.

Her animasyon elementinin hangi motor tarafından yönetileceği net olmalı.

## GSAP kuralları

- GSAP pluginlerini yalnızca client tarafında register et.
- `useGSAP` kullan.
- Her animasyonu bir scope veya ref içine bağla.
- Component unmount olduğunda timeline ve ScrollTrigger instance’larını temizle.
- Global selector kullanımını minimumda tut.
- Bir componentin animasyonu başka bir section’ın DOM elementine bağlı olmasın.
- `gsap.context` veya `useGSAP` scope kullan.
- Responsive timeline için `gsap.matchMedia` kullan.
- Mobilde daha hafif animasyonlar çalıştır.
- Ekran dışında kalan animasyon ve videoları durdur.
- Görseller yüklendikten sonra gerektiğinde ScrollTrigger refresh yap.
- Animasyon ayarlarını componentlerin içine dağınık şekilde yazma.
- Section bazlı config veya timeline dosyalarında merkezi yönet.

Animasyonlarda öncelikli olarak:

- `transform`
- `translate`
- `scale`
- `rotate`
- `opacity`

kullan.

Mümkün olduğunca şunları animasyona sokma:

- `width`
- `height`
- `top`
- `left`
- Büyük blur değerleri
- Ağır box-shadow değişimleri

## Smooth scroll

İlk aşamada native browser scroll kullan.

GSAP ScrollTrigger native scroll ile düzgün çalışmalı.

Figma ve video gerçekten özel smooth scroll deneyimi gerektiriyorsa Lenis eklenebilir.

Lenis eklenirse:

- ScrollTrigger ile senkronize et.
- Mobilde kapatılabilir yap.
- Kullanıcının normal scroll davranışını bozma.
- Accessibility sorununa yol açma.

## 3D kullanımı

Figma veya videoda gerçek bir 3D ürün modeli yoksa Three.js ekleme.

2D görsel katmanları, parallax, scale, rotate ve scroll animasyonlarında GSAP kullan.

Sadece gerçek `.glb` veya `.gltf` model varsa şu paketleri değerlendir:

- Three.js
- `@react-three/fiber`
- `@react-three/drei`

3D componenti ayrı ve lazy-loaded Client Component yap.

## Önerilen klasör mimarisi

Mevcut repository mimarisine uyum sağla.

Uygun bir yapı yoksa aşağıdaki yapıyı temel al:

```text
src/
  app/
    (storefront)/
      layout.tsx
      page.tsx
      loading.tsx
      error.tsx
      privacy/
      returns/
      terms/

    api/
      webhooks/
        shopify/
          route.ts

    actions/
      cart-actions.ts

    globals.css

  components/
    layout/
      Header.tsx
      MobileMenu.tsx
      Footer.tsx

    sections/
      hero/
        HeroSection.tsx
        HeroMotion.tsx

      product-story/
        ProductStorySection.tsx
        ProductStoryMotion.tsx

      product-features/
      product-gallery/
      product-details/
      testimonials/
      faq/
      purchase/

    commerce/
      ProductPrice.tsx
      ProductGallery.tsx
      VariantSelector.tsx
      QuantitySelector.tsx
      AddToCartButton.tsx
      BuyNowButton.tsx
      CartDrawer.tsx
      CartItem.tsx

    motion/
      MotionProvider.tsx
      Reveal.tsx
      MagneticButton.tsx
      PageTransition.tsx

    ui/
      Button.tsx
      Dialog.tsx
      Accordion.tsx
      Container.tsx

  features/
    cart/
      cart-store.ts
      cart-types.ts
      cart-utils.ts

  lib/
    shopify/
      client.ts
      fragments.ts
      types.ts
      queries/
        product.ts
        cart.ts
      mutations/
        cart-create.ts
        cart-add.ts
        cart-update.ts
        cart-remove.ts

    animation/
      gsap.ts
      motion-config.ts
      breakpoints.ts

    analytics/
    env.ts
    utils.ts

  styles/
    tokens.css
    typography.css
    animations.css

  types/
    shopify.ts
```

## Figma uygulama kuralları

Figma tasarımını yorumlayarak değiştirme.

Şunları mümkün olduğunca birebir uygula:

- Grid
- Container genişlikleri
- Section yükseklikleri
- Typography
- Font weight
- Line-height
- Letter-spacing
- Renkler
- Gradientler
- Border radius
- Shadow
- Görsel oranları
- Spacing
- Responsive davranış
- Desktop ve mobil hizalamalar

Figma assetlerini placeholder ile değiştirme.

Figma’dan gelen görsel ve ikonları indirerek projeye ekle.

Geçici Figma asset URL’lerini production kodunda kullanma.

SVG ikonlarını elle tahmin ederek yeniden çizme.

Font dosyaları repository içinde yoksa uygun resmî web font entegrasyonunu kullan.

## Design token yapısı

Figma renklerini, typography ve spacing değerlerini CSS variables haline getir.

Örnek:

```text
--color-background
--color-foreground
--color-accent
--color-muted
--font-display
--font-body
--space-section
--container-width
--header-height
--radius-button
```

Componentlerin içine rastgele hex değerleri dağıtma.

Responsive breakpointleri merkezi yönet.

## Responsive gereksinimleri

En az şu ekran genişliklerini test et:

- 375px
- 390px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

Mobil tasarımı masaüstünün küçültülmüş hali yapma.

Mobil için:

- Ayrı animasyon değerleri kullan.
- Gerekirse pinned sectionları kaldır.
- Büyük parallax hareketlerini azalt.
- Görsellerin taşmasını engelle.
- CTA alanlarını erişilebilir yap.
- Sticky satın alma alanını değerlendir.
- Header ve menüyü mobil tasarıma göre uygula.

Yatay scroll oluşmamalı.

## Performans kuralları

Site animasyon yoğun olsa da Core Web Vitals mümkün olduğunca iyi kalmalı.

Uygula:

- Tüm sayfayı Client Component yapma.
- Ağır sectionları `next/dynamic` ile lazy load et.
- İlk ekran dışındaki animasyon kodlarını ertele.
- `next/image` kullan.
- Görseller için doğru `sizes` değeri tanımla.
- Hero görselini gerektiğinde priority yap.
- Aşağıdaki görselleri lazy load et.
- GIF yerine WebM veya MP4 kullan.
- Büyük videoları otomatik preload etme.
- Video poster görseli kullan.
- Görünmeyen videoyu durdur.
- Bundle boyutunu kontrol et.
- Shopify sorgularında yalnızca gerekli alanları çek.
- Client’a gereksiz büyük ürün objeleri gönderme.
- Font yüklemelerini optimize et.
- Layout shift oluşturma.
- Görseller için width ve height tanımla.
- Üçüncü parti scriptleri lazy yükle.

## Accessibility

Şunları uygula:

- Semantic HTML
- Doğru heading sıralaması
- Klavye ile kullanım
- Görünür focus durumu
- Dialog focus trap
- Escape ile modal ve drawer kapatma
- Butonlarda erişilebilir isimler
- Görsellere anlamlı alt metin
- Renk kontrastı
- Form label yapısı
- `aria-live` ile sepete ekleme bildirimi
- `prefers-reduced-motion`

Reduced motion açıkken:

- Dekoratif scroll animasyonlarını kaldır.
- Uzun timeline’ları sadeleştir.
- Parallax’ı kapat.
- İçeriği görünür bırak.
- Satın alma fonksiyonlarının tamamını çalışır tut.

## SEO

Ekle:

- Next.js Metadata API
- Dinamik title
- Meta description
- Canonical URL
- Open Graph
- Twitter card
- Shopify ürün bilgilerine dayalı Product JSON-LD
- Fiyat
- Para birimi
- Stok durumu
- Ürün görseli
- Gerekirse Breadcrumb structured data
- Robots
- Sitemap
- Semantic heading yapısı

## Shopify cache ve webhook

Ürün içeriğini cache’le.

Sepet ve checkout işlemlerini cache’leme.

Shopify ürün veya stok güncellendiğinde ilgili Next.js cache’ini temizlemek için webhook endpoint’i oluştur.

Değerlendir:

- `products/update`
- `products/delete`
- İlgili inventory update eventi

Webhook imzasını doğrula.

Doğrulama başarısızsa isteği reddet.

Cache revalidation için ürün handle veya ürün ID tabanlı tag kullan.

## Hata yönetimi

Aşağıdaki durumları düzgün yönet:

- Shopify API erişilemiyor
- Ürün bulunamadı
- Varyant seçilmedi
- Ürün stokta yok
- Sepete ekleme başarısız
- Checkout URL oluşturulamadı
- İnternet bağlantısı kesildi
- Shopify’dan eski sepet döndü
- Geçersiz cart ID
- Fiyat değişti
- Checkout öncesinde stok tükendi

Kullanıcıya teknik GraphQL hatası gösterme.

Loglarda detaylı hata, arayüzde anlaşılır mesaj göster.

## Testler

### Unit ve component testleri

- Varyant seçimi
- Adet artırma ve azaltma
- Stokta olmayan varyant
- Fiyat gösterimi
- İndirimli fiyat
- Sepet loading durumu
- Cart store
- Shopify response mapping
- Environment validation

### Playwright E2E

- Ana sayfa açılıyor
- Ürün görünüyor
- Varyant seçiliyor
- Ürün sepete ekleniyor
- Cart drawer açılıyor
- Adet güncelleniyor
- Ürün sepetten siliniyor
- Hemen satın al checkout’a yönlendiriyor
- Mobil menü çalışıyor
- Reduced motion modunda site kullanılabiliyor

Gerçek ödeme işlemini tamamlamak zorunlu değil.

Checkout URL yönlendirmesini test et.

## Kod kalitesi

- TypeScript strict mode kullan.
- `any` kullanma.
- GraphQL response tiplerini açık tanımla.
- Tekrarlanan kodları ayır.
- Aşırı soyutlama yapma.
- Gereksiz generic yapılar oluşturma.
- Componentleri makul boyutta tut.
- Büyük sectionları alt componentlere ayır.
- Server ve client kodunu aynı dosyada karıştırma.
- Environment değişkenlerini merkezi tut.
- Magic number değerlerini azalt.
- Animasyon ayarlarını merkezi config yapısına taşı.
- ESLint hatası bırakma.
- TypeScript hatası bırakma.
- Kullanılmayan import bırakma.
- Console log bırakma.
- Placeholder bırakma.
- TODO bırakma.

## Kesinlikle yapılmaması gerekenler

- Shopify Liquid tema geliştirme
- Hydrogen kullanma
- Redux ekleme
- Tüm ana sayfaya `use client` koyma
- Ürün fiyatını kod içine sabitleme
- Ürün veya varyant ID’sini sabitleme
- Checkout sistemini sıfırdan yazma
- Kredi kartı bilgisini Next.js tarafında işleme
- Shopify private token’ını browser’a açma
- Figma’dan bağımsız rastgele UI oluşturma
- Videoda olmayan gereksiz animasyon ekleme
- Her section için farklı animasyon yaklaşımı kullanma
- GSAP ve Motion’ı aynı elementte çakıştırma
- Mobilde masaüstü animasyonunu aynen çalıştırma
- Ağır animasyonları eager load etme
- Accessibility bozan custom scroll oluşturma
- Geçici Figma asset URL’lerini production kodunda kullanma

## Beklenen sonuç

Çalışmanın sonunda:

1. Figma tasarımına mümkün olduğunca birebir Next.js arayüzü
2. Referans videoya uygun animasyonlar
3. Desktop, tablet ve mobil responsive yapı
4. Düzenli section ve component mimarisi
5. Shopify Storefront API bağlantısı
6. Dinamik ürün, fiyat, varyant ve stok
7. Çalışan Shopify Cart API entegrasyonu
8. Sepete ekleme
9. Hemen satın alma
10. Shopify checkout yönlendirmesi
11. GSAP ve ScrollTrigger ile section bazlı animasyonlar
12. Motion ile drawer, modal ve mikro animasyonlar
13. Reduced motion desteği
14. SEO ve Product JSON-LD
15. Shopify webhook ve cache invalidation
16. Unit ve E2E testleri
17. Production build alınabilen temiz proje

hazır olmalı.

## Uygulama sırası

Şu sırayla ilerle:

1. Repository analizi
2. Figma analizi
3. Referans video analizi
4. Section ve component haritası
5. Animasyon spesifikasyonu
6. Design token kurulumu
7. Shopify client ve GraphQL katmanı
8. Server Component sayfa iskeleti
9. Client animation island componentleri
10. Sepet ve checkout akışı
11. Responsive uyarlama
12. Accessibility
13. SEO
14. Webhook ve cache
15. Unit testleri
16. Playwright testleri
17. Lint
18. TypeScript kontrolü
19. Production build
20. Son rapor

Her önemli aşamadan sonra TypeScript kontrolü, lint ve build çalıştır.

Bir hata oluşursa çözmeden sonraki aşamaya geçme.

Mevcut kodu gereksiz yere baştan yazma.

Repository içindeki sağlam yapıları koru ve yalnızca gerekli alanları değiştir.

## Teslim raporu

İşlem tamamlandığında şu sırayla rapor ver:

1. Uygulanan mimarinin özeti
2. Figma’dan çıkarılan sectionlar
3. Videodan çıkarılan animasyonlar
4. Oluşturulan ve değiştirilen dosyalar
5. Kurulan paketler
6. Shopify’da yapılması gereken ayarlar
7. Gerekli environment değişkenleri
8. Çalışan animasyonların listesi
9. Responsive davranışların özeti
10. Test sonuçları
11. Lint sonucu
12. TypeScript sonucu
13. Build sonucu
14. Bilinen eksikler
15. Figma veya videodan net alınamayan bilgiler

https://www.figma.com/design/cDnAz0x6OwC927w7MFAVkV/Articut-Website?node-id=0-1&t=GfQdvu0zIQ21e8q1-1