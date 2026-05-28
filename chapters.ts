import { Chapter } from '../types';

export const chapters: Record<string, Chapter> = {
  'ch1': {
    id: 'ch1',
    title: 'Bagian I: Puing-Puing Singasari',
    subtitle: 'Runtuhnya Kejayaan, Lahirnya Tekad Baru',
    description: 'Tahun 1292 Saka. Istana Singasari membara akibat kudeta berdarah Jayakatwang dari Gelang-Gelang. Raja Kertanegara gugur dalam hening. Di bawah bayang-bayang kepulan asap hitam, Raden Wijaya beserta sisa pengikut setianya berjuang meloloskan diri dari kepungan prajurit Kadiri.',
    startSceneId: 'ch1_scene_start',
    scenes: {
      'ch1_scene_start': {
        id: 'ch1_scene_start',
        character: 'Narator',
        text: 'Langit Tumapel berwarna semerah darah. Kobaran api menjilat atap Candi Jawi, membawa serta abu kemegahan Singasari yang runtuh dalam semalam. Di gubuk tersembunyi dekat perbatasan Sungai Brantas, Raden Wijaya memandang sisa parang di genggamannya. Ia terengah-engah, diselimuti kesedihan mendalam atas gugurnya mertuanya, Kertanegara...',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'tension',
        nextSceneId: 'ch1_scene_dialog1'
      },
      'ch1_scene_dialog1': {
        id: 'ch1_scene_dialog1',
        character: 'Ranggalawe',
        text: 'Gusti Raden! Pengawal garis depan melapor bahwa sisa pasukan berkuda Kadiri menyisir area bantaran Kali Brantas. Gerbang timur telah dikuasai musuh. Kita terdesak, Gusti! Apa perintahmu?',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'drum',
        nextSceneId: 'ch1_scene_dialog2'
      },
      'ch1_scene_dialog2': {
        id: 'ch1_scene_dialog2',
        character: 'Raden Wijaya',
        text: 'Singasari boleh terbakar, Kakang Lawe. Namun darah Rajasa di nadi kita tidak boleh padam sia-sia sekarang. Kita harus merawat nyala api perjuangan ini.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'gamelan_ambient',
        nextSceneId: 'ch1_scene_choice1'
      },
      'ch1_scene_choice1': {
        id: 'ch1_scene_choice1',
        character: 'Narator',
        text: 'Pasukan musuh mendekat dengan obor menyala. Suara kaki kuda menggetarkan tanah bumi Tumapel. Raden Wijaya dihadapkan pada keputusan taktis pertama untuk menyelamatkan pasukannya yang letih.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'tension',
        choices: [
          {
            id: 'ch1_opt1_a',
            text: 'Serang barisan lini belakang musuh untuk merebut jalur pelarian (Gaya Ksatria)',
            nextSceneId: 'ch1_fight_path',
            gamelanTone: 'slendro',
            wiraImpact: 15,
            karmaImpact: -5,
            log: 'Raden Wijaya memilih jalur pertarungan terbuka di Kali Brantas, melambangkan keberandalan ksatria sejati.'
          },
          {
            id: 'ch1_opt1_b',
            text: 'Menyeberangi Kali Brantas secara senyap dalam kegelapan (Gaya Siasat)',
            nextSceneId: 'ch1_stealth_path',
            gamelanTone: 'miring',
            wiraImpact: -5,
            karmaImpact: 15,
            log: 'Raden Wijaya memilih taktik navigasi sunyi, menyelamatkan nyawa pengikutnya dari serbuan Kadiri.'
          }
        ]
      },
      
      // Fight Path
      'ch1_fight_path': {
        id: 'ch1_fight_path',
        character: 'Lembu Sora',
        text: 'Uraah! Demi panji agung Singasari! Keris kami haus akan darah pengkhianat Gelang-Gelang!',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'drum',
        faktaSejarah: {
          title: 'Praktik Bela Diri & Ksatria Jawa Kuna',
          topic: 'Way Of Wira',
          content: 'Dalam tradisi ksatria Jawa kuno, heroisme jasmani (Wira) sangat dihormati. Bertempur demi kedaulatan negara walaupun dalam kekalahan dipandang sebagai jalan mulia mencapai alam moksa di surga dewa.',
          philosophy: '"Rame ing gawe, sepi ing pamrih" - Berjuang dengan gigih tanpa pamrih pribadi.'
        },
        nextSceneId: 'ch1_unite_madura'
      },

      // Stealth Path
      'ch1_stealth_path': {
        id: 'ch1_stealth_path',
        character: 'Nambi',
        text: 'Sstt... Redakan nafas kalian. Sungai Brantas mengalir deras di depan, namun kegelapan malam ini adalah zirah pelindung kita. Ikuti bimbingan air.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'forest',
        faktaSejarah: {
          title: 'Bengawan Solo & Kali Brantas',
          topic: 'Urat Nadi Transportasi Jawa',
          content: 'Kali Brantas adalah jalur transportasi vital Jawa Timur kuno. Penguasaan atas delta Brantas menentukan makmur tidaknya pelabuhan dagang internasional seperti Canggu dan Hujung Galuh.',
          philosophy: '"Alon-alon waton kelakon" - Keselamatan langkah lebih utama daripada gegabah terburu-buru.'
        },
        nextSceneId: 'ch1_unite_madura'
      },

      'ch1_unite_madura': {
        id: 'ch1_unite_madura',
        character: 'Narator',
        text: 'Setelah berhasil meloloskan diri dari kejaran musuh, rombongan Raden Wijaya mengarah ke utara. Atas saran dari kawan-kawannya, mereka berlayar menyeberangi selat sempit menuju Sumenep di Pulau Madura. Di sana bernaung sang ahli strategi ulung: Adipati Arya Wiraraja.',
        backgroundUrl: 'fajar_wilwatikta_lobby',
        audioPrompt: 'gong',
        nextSceneId: 'ch1_wiraraja_meet'
      },
      'ch1_wiraraja_meet': {
        id: 'ch1_wiraraja_meet',
        character: 'Arya Wiraraja',
        text: 'Selamat datang, menantu Kertanegara yang mulia. Aku telah mengendus petaka Singasari dari tiupan angin barat. Singgasana Jayakatwang saat ini goyah karena kesombongannya sendiri. Jika engkau rindu membalas budi dan menegakkan keadilan, jangan gunakan pedang tumpatmu dulu. Gunakan kepala dinginmu.',
        backgroundUrl: 'fajar_wilwatikta_lobby',
        audioPrompt: 'gamelan_ambient',
        nextSceneId: 'ch1_wiraraja_choice'
      },
      'ch1_wiraraja_choice': {
        id: 'ch1_wiraraja_choice',
        character: 'Arya Wiraraja',
        text: 'Siasatku adalah: berpura-puralah tunduk pada Jayakatwang di Kediri. Pintalah sebidang tanah liar di tepi Sungai Brantas, yaitu Hutan Tarik yang dikeramatkan. Katakan engkau ingin mendirikan padepokan berburu untuk peristirahatannya. Jayakatwang akan luluh. Bagaimana pendapatmu, Anakda?',
        backgroundUrl: 'fajar_wilwatikta_lobby',
        audioPrompt: 'tension',
        choices: [
          {
            id: 'ch1_opt2_a',
            text: 'Menerima usulan Wiraraja sepenuhnya. Diplomat jenius tak boleh ditentang. (Paham Siasat)',
            nextSceneId: 'ch1_accept_siasat',
            gamelanTone: 'gong',
            wiraImpact: 5,
            karmaImpact: 15,
            log: 'Raden Wijaya menerima taktik makar bertahap dari Arya Wiraraja untuk berpura-pura tunduk.'
          },
          {
            id: 'ch1_opt2_b',
            text: 'Menerima tapi mengajukan syarat agar pengikut setia Singasari tetap dipersenjatai sembunyi-sembunyi. (Tingkat Waspada)',
            nextSceneId: 'ch1_conditional_siasat',
            gamelanTone: 'kempyang',
            wiraImpact: 15,
            karmaImpact: 5,
            log: 'Raden Wijaya menerima taktik siasat seraya memperkuat pertahanan taktis militer rahasianya.'
          }
        ]
      },
      'ch1_accept_siasat': {
        id: 'ch1_accept_siasat',
        character: 'Arya Wiraraja',
        text: 'Bagus sekali! Jayakatwang tidak akan curiga pada ksatria yang memperlihatkan kerendahan hati palsu. Aku akan menugaskan kurirku melunakkan hatinya demi perjalananmu ke Kediri.',
        backgroundUrl: 'fajar_wilwatikta_lobby',
        audioPrompt: 'gamelan_ambient',
        nextSceneId: 'ch1_end'
      },
      'ch1_conditional_siasat': {
        id: 'ch1_conditional_siasat',
        character: 'Ranggalawe',
        text: 'Ide cerdas Gusti Wijaya! Kami akan menyamar menjadi rombongan petani pembawa kayu bakar, namun di bawah tumpukan jerami kami menyembunyikan tameng baja berkilau.',
        backgroundUrl: 'fajar_wilwatikta_lobby',
        audioPrompt: 'victory',
        nextSceneId: 'ch1_end'
      },
      'ch1_end': {
        id: 'ch1_end',
        character: 'Narator',
        text: 'Maka disepakatilah skenario agung yang kelak mengubah peta kekuasaan seluruh Nusantara. Raden Wijaya memantapkan hatinya melangkah menuju Kediri dengan topeng kesetiaan palsu, siap membakar bara dalam sekam.',
        backgroundUrl: 'fajar_wilwatikta_lobby',
        audioPrompt: 'gong',
        nextSceneId: 'ch2_chapter_intro'
      }
    }
  },
  'ch2': {
    id: 'ch2',
    title: 'Bagian II: Babat Alas Tarik',
    subtitle: 'Menanam Benih Peradaban Baru',
    description: 'Tahun 1293 Masehi. Pengajuan izin Raden Wijaya disetujui Jayakatwang yang lengah. Rombongan Raden Wijaya beserta ratusan sukarelawan Madura berduyun-duyun mendatangi Hutan Tarik yang penuh mitos wingit, belantara sunyi tak terjamah manusia.',
    startSceneId: 'ch2_chapter_intro',
    scenes: {
      'ch2_chapter_intro': {
        id: 'ch2_chapter_intro',
        character: 'Narator',
        text: 'Hutan Tarik menyambut mereka dengan kanopi beringin raksasa yang menutup datangnya sinar mentari fajar. Suara desau angin malam menyatu dengan riak air Brantas. Di tanah penuh pepohonan purba ini, fondasi pertama kerajaan raksasa Nusantara akan ditancapkan sekop demi sekop.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'forest',
        nextSceneId: 'ch2_alas_tarik_start'
      },
      'ch2_alas_tarik_start': {
        id: 'ch2_alas_tarik_start',
        character: 'Lembu Sora',
        text: 'Gusti Wijaya, daerah ini sangat lebat dan dilingkupi kabut tebal yang aneh. Sebagian penebang hutan kami merasa ketakutan, mereka mendengar suara tangisan gaib dari lubang beringin putih purba di utara. Mereka ingin berhenti membabat bagian itu.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'tension',
        nextSceneId: 'ch2_alas_choice1'
      },
      'ch2_alas_choice1': {
        id: 'ch2_alas_choice1',
        character: 'Narator',
        text: 'Kepercayaan mistis sangat kuat di tanah Jawa kuno. Menghadapi mistisisme lokal, tindakan Raden Wijaya akan menentukan kestabilan ketenangan batin rakyatnya.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'tension',
        choices: [
          {
            id: 'ch2_opt1_a',
            text: 'Lakukan upacara selamatan/sesaji di bawah beringin putih untuk menghormati alam (Harmoni Kosmis)',
            nextSceneId: 'ch2_sesaji_path',
            gamelanTone: 'gong',
            wiraImpact: -5,
            karmaImpact: 20,
            log: 'Raden Wijaya melakukan ritus penghormatan leluhur pelindung alam, memperkuat kedamaian spiritual rombongan.'
          },
          {
            id: 'ch2_opt1_b',
            text: 'Tegur dengan tegas tahayul itu, pimpin penebangan langsung di garis depan (Ketegasan Ksatria)',
            nextSceneId: 'ch2_brave_path',
            gamelanTone: 'slendro',
            wiraImpact: 20,
            karmaImpact: -5,
            log: 'Raden Wijaya mengesampingkan kekhawatiran gaib untuk mengejar batas waktu pembangunan pos pertahanan.'
          }
        ]
      },

      // Sesaji path
      'ch2_sesaji_path': {
        id: 'ch2_sesaji_path',
        character: 'Patih Nambi',
        text: 'Nasi tumpeng, pisang ayu, dan dupa harum dikorbankan dengan doa suci. Ajaib, kabut yang pekat perlahan bertiup menyingkir dipeluk tiupan angin lembut. Hati rakyat kembali tentram, Gusti.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'gamelan_ambient',
        faktaSejarah: {
          title: 'Konsep Harmoni Mikro-Makrokosmos',
          topic: 'Filosofi Hidup Jawa',
          content: 'Budaya Jawa menjunjung keselarasan antara jagad cilik (mikrokosmos/diri sendiri) dan jagad gede (makrokosmos/alam semesta). Alam tidak diposisikan sebagai objek taklukan, melainkan entitas hidup berdampingan.',
          philosophy: '"Memayu Hayuning Bawana" - Memperindah keindahan bumi dan menjaga keserasian lingkungan hidup.'
        },
        nextSceneId: 'ch2_buah_pahit_scene'
      },

      // Brave path
      'ch2_brave_path': {
        id: 'ch2_brave_path',
        character: 'Ranggalawe',
        text: 'Lihat! Tebasan kapak Gusti Wijaya merobohkan cabang beringin tanpa ada malapetaka apapun! Jiwa ksatria tidak mengenal gentar pada bayangan semu!',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'drum',
        faktaSejarah: {
          title: 'Kepemimpinan Ksatria Nusantara',
          topic: 'Wira & Kepemimpinan Nyata',
          content: 'Seorang pemimpin Nusantara dituntut berjiwa berani menepis pamali palsu yang menghambat kesejahteraan sosial rakyat, menunjukkan kekarismatikan pribadi yang kuat mengatasi ragu.',
          philosophy: '"Sura dira jayaningrat lebur dening pangastuti" - Keberanian yang dilandasi kearifan melembutkan segala kerasnya rintangan.'
        },
        nextSceneId: 'ch2_buah_pahit_scene'
      },

      'ch2_buah_pahit_scene': {
        id: 'ch2_buah_pahit_scene',
        character: 'Prajurit Penebang',
        text: 'Aduh! Aduhai pahit sekali lidah saya! Gusti! Kami menemukan tanaman rambat berbuah hijau bundar seperti semangka kecil. Rasanya luar biasa pahit, tenggorokan sampai terbakar!',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'tension',
        nextSceneId: 'ch2_maja_speech'
      },
      'ch2_maja_speech': {
        id: 'ch2_maja_speech',
        character: 'Raden Wijaya',
        text: 'Buah apakah ini? Benar... pahitnya tiada tara, menusuk kalbu. Namun dengarlah, saudariku! Kepahitan tanah liar ini adalah saksi kepahitan perjuangan kita tersingkir dari rumah leluhur! Tempat ini kelak kusebut: MAJAPAHIT.',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'gong',
        nextSceneId: 'ch2_nama_choice'
      },
      'ch2_nama_choice': {
        id: 'ch2_nama_choice',
        character: 'Raden Wijaya',
        text: 'Sejarah akan mencatat tempat ini berdiri. Selain nama Majapahit, aku bermaksud merumuskan dasar semangat dari peradaban baru kita ini. Apa landasan luhur kita, saudariku?',
        backgroundUrl: 'hutan_tarik_twilight',
        audioPrompt: 'tension',
        choices: [
          {
            id: 'ch2_opt2_a',
            text: 'Kemerdekaan penuh, kemakmuran tani, kesetiaan pada kebenaran. (Paham Kesejahteraan)',
            nextSceneId: 'ch2_end_tani',
            gamelanTone: 'gong',
            wiraImpact: 5,
            karmaImpact: 15,
            log: 'Raden Wijaya menetapkan visi tani yang gemah ripah loh jinawi seimbang dengan kedamaian semesta.'
          },
          {
            id: 'ch2_opt2_b',
            text: 'Keperkasaan bala tentara samudera, menguasai seluruh persilangan maritim. (Paham Kemaritiman)',
            nextSceneId: 'ch2_end_maritim',
            gamelanTone: 'kempyang',
            wiraImpact: 15,
            karmaImpact: 5,
            log: 'Raden Wijaya meletakkan benih armada bahari nusa yang mendominasi lautan sutra Nusantara.'
          }
        ]
      },
      'ch2_end_tani': {
        id: 'ch2_end_tani',
        character: 'Narator',
        text: 'Kata sepakat terucap tulus dari hati segenap abdi tani yang bermukim. Desa pemukiman baru berdiri subur, dikelilingi pagar parit pertahanan kokoh. Wilwatikta menjelma jadi lumbung padi strategis yang siap menyokong kebangkitan kedaulatan ksatria sejati.',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'victory',
        nextSceneId: 'ch3_start_scene'
      },
      'ch2_end_maritim': {
        id: 'ch2_end_maritim',
        character: 'Narator',
        text: 'Dengan galangan kapal pertama di muara Kali Mas Brantas, jalur perdagangan sungai mulai memanas. Berita kedamaian fajar baru di Tarik menyebar memikat kaum ksatria pelarian pembela kedaulatan untuk datang mengabdi setia.',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'victory',
        nextSceneId: 'ch3_start_scene'
      }
    }
  },
  'ch3': {
    id: 'ch3',
    title: 'Bagian III: Fajar Wilwatikta',
    subtitle: 'Kemenangan Diplomasi, Berdirinya Kekaisaran',
    description: 'Awal tahun 1294 Masehi. Ratusan kapal perang Dinasti Yuan Mongol mendarat di pantai utara Jawa di bawah komando Panglima Shi-bi dan Ike Mese. Mereka datang membalas perlakuan Kertanegara yang melukai utusan Meng Qi, tanpa mengetahui sang raja telah wafat digulingkan Jayakatwang.',
    startSceneId: 'ch3_start_scene',
    scenes: {
      'ch3_start_scene': {
        id: 'ch3_start_scene',
        character: 'Narator',
        text: 'Pasukan asing berkuda dengan perlengkapan anyaman besi mendarat gagah. Negeri asing mengira akan menghadapi Singasari, namun takdir menuntun mereka menemui pemuda visioner di tepi alas Tarik. Raden Wijaya melihat peluang diplomatik tercanggih abad pertengahan.',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'drum',
        nextSceneId: 'ch3_mongol_negotiation'
      },
      'ch3_mongol_negotiation': {
        id: 'ch3_mongol_negotiation',
        character: 'Raden Wijaya',
        text: 'Selamat datang utusan agung Kekhanan Agung Kublai Khan. Ketahuilah, raja penentang mandat langit yang menyiksa utusan kaisar telah mati. Kini bertahta sang durjana pembunuh mertuaku, Jayakatwang di Kediri. Mari kita bergandengan tangan, hancurkan musuh bersama itu.',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'gamelan_ambient',
        nextSceneId: 'ch3_choice_diplomatic'
      },
      'ch3_choice_diplomatic': {
        id: 'ch3_choice_diplomatic',
        character: 'Narator',
        text: 'Strategi perang yang dahsyat bergulir. Pasukan gabungan Mongol-Majapahit menyerbu jantung kota Kadiri. Jayakatwang pun takluk. Namun, demi nasib kedaulatan Jawa yang mengakar bebas, Raden Wijaya tidak boleh menyerahkan upeti takluk abadi kepada Kublai Khan.',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'tension',
        choices: [
          {
            id: 'ch3_opt1_a',
            text: 'Gempur perkemahan tentara Yuan yang mabuk kemenangan berbekal kejutan perang gerilya. (Pemberontakan Kilat)',
            nextSceneId: 'ch3_rebellion_path',
            gamelanTone: 'slendro',
            wiraImpact: 20,
            karmaImpact: -5,
            log: 'Raden Wijaya memimpin serangan fajar dadakan mengusir bala tentara kekaisaran Yuan dari bumi Jawa.'
          },
          {
            id: 'ch3_opt1_b',
            text: 'Rancang manipulasi penjemputan upeti putri upeti, jebak para jenderal Mongol di rimba Tarik. (Taktik Kancil)',
            nextSceneId: 'ch3_trap_path',
            gamelanTone: 'miring',
            wiraImpact: -5,
            karmaImpact: 20,
            log: 'Raden Wijaya menggunakan muslihat diplomatik murni menjebak rombongan komando Yuan hingga tercerai-berai.'
          }
        ]
      },

      // Rebellion path
      'ch3_rebellion_path': {
        id: 'ch3_rebellion_path',
        character: 'Ranggalawe',
        text: 'Mereka tidak menduga amarah ksatria nusantara akan membara sedahsyat ini! Prajurit bertameng busur paku kami menggasak tentara Yuan hingga mundur serabutan terbirit-birit ke dermaga kapal mereka!',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'drum',
        faktaSejarah: {
          title: 'Arsitektur Militer & Pengusiran Pasukan Yuan',
          topic: 'Kemenangan Militer Terbesar Jawa',
          content: 'Serangan fajar Raden Wijaya pada tahun 1293 mengoyak rantai komando tentara Mongol/Yuan yang terkenal tak terkalahkan di Asia. Keberhasilan ini memaksa mereka berlayar pulang membawa kegagalan geopolitik total.',
          philosophy: '"Adigang, adigung, adiguna" - Menghindari watak angkuh mengandalkan kekuasaan gajah semata.'
        },
        nextSceneId: 'ch3_coronation_ceremony'
      },

      // Trap path
      'ch3_trap_path': {
        id: 'ch3_trap_path',
        character: 'Patih Nambi',
        text: 'Sungguh malang nasib perwira Yuan itu. Menyangka menjemput upeti selir cantik dan ribuan keping emas, mereka malahan disambut hujan anak panah beracun di labirin semak Tarik. Siasat kancil terbukti mematikan.',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'tension',
        faktaSejarah: {
          title: 'Strategi Politik Luar Negeri Jawa Raya',
          topic: 'Diplomasi Tingkat Tinggi',
          content: 'Raden Wijaya memanfaatkan perang asing untuk menyelesaikan pertikaian internal dinasti di tanah Jawa, membuktikan bahwa kecemerlangan intelek (Sastra) sejajar dengan keampuhan senjata (Gending).',
          philosophy: '"Ing ngarsa sung tulada, ing madya mangun karsa" - Memberi teladan teguh dalam meniti badai cobaan dunia.'
        },
        nextSceneId: 'ch3_coronation_ceremony'
      },

      'ch3_coronation_ceremony': {
        id: 'ch3_coronation_ceremony',
        character: 'Narator',
        text: 'Bumi Jawa kembali bersih dari pendudukan pasukan asing. Musuh-musuh dari dalam dan luar runtuh ditiup angin sejarah yang berganti arah. Hari kesepuluh bulan Kartika, tahun 1215 Saka (10 November 1293 Masehi), sang fajar baru yang agung bersinar membakar kabut kegelapan...',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'gong',
        nextSceneId: 'ch3_coronation_speech'
      },
      'ch3_coronation_speech': {
        id: 'ch3_coronation_speech',
        character: 'Raden Wijaya',
        text: 'Mulai saat ini, di hadapan gunung suci Penataran dan sungai Brantas yang perkasa, aku menobatkan diri dengan gelar KERTARAJASA JAYAWARDHANA! Kerajaan MAJAPAHIT berdiri kokoh menggandeng persaudaraan seluruh pulau Nusantara! Fajar Wilwatikta telah terbit melambangkan kemandirian kekal bangsa!',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'victory',
        nextSceneId: 'ch3_final_stats'
      },
      'ch3_final_stats': {
        id: 'ch3_final_stats',
        character: 'Narator',
        text: 'Perjalanan panjang yang agung dari seorang pengembara tertindas hingga dinobatkan menjadi Kaisar Tertinggi Nusantara berakhir indah. Warisan kebudayaan, persatuan bhinneka nusa, serta keberanian abadi terpatri dalam jiwa pusaka peradaban kita.',
        backgroundUrl: 'majapahit_fajar_victory',
        audioPrompt: 'gong',
        nextSceneId: 'story_completed' // Special end code
      }
    }
  }
};
