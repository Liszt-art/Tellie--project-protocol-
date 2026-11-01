import { Post, MoodEntry, GardenPlant } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorNickname: 'Bạn Sao Băng #312',
    authorSpirit: 'star',
    title: 'Áp lực đồng trang lứa sau kỳ thi tuyển dụng thực tập sinh...',
    content: 'Thấy bạn bè trong khoa ai cũng có offer các công ty lớn, còn mình nộp 6 nơi vẫn chưa nhận được hồi âm. Mình biết mỗi người một lộ trình, nhưng đêm nay ngồi nhìn màn hình laptop tự dưng nước mắt cứ trào ra. Có ai đang thấy mình bị bỏ lại phía sau không?',
    moodId: 'lost',
    category: 'hoc-tap',
    categoryLabelVi: 'Học tập & Tương lai',
    hashtags: ['apluc', 'thuctap', 'dongtranglua'],
    supportiveCount: 47,
    userReacted: false,
    createdAt: '2026-10-30T19:40:00Z',
    isPrivate: false,
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorNickname: 'Gấu Ngủ Ngày #81',
        authorAvatar: 'cloud',
        content: 'Mình cũng từng trượt 8 chỗ năm ngoái bạn ơi. Đừng tự trách mình nhé, đôi khi vũ trụ đang dẫn bạn đến đúng nơi phù hợp hơn thôi. Cố lên nhé đồng môn!',
        createdAt: '2026-10-30T20:05:00Z'
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorNickname: 'Đêm Trắng #502',
        authorAvatar: 'moon',
        content: 'Gửi bạn một cái ôm thật chặt từ ký túc xá khu B. Hôm nay nghỉ ngơi thôi, đừng mở LinkedIn nữa nha bạn.',
        createdAt: '2026-10-30T20:22:00Z'
      }
    ],
    tellieReply: {
      spiritName: 'Tellie Spirit',
      badgeVi: 'Lời vỗ về từ Tellie',
      message: 'Cảm giác bị tụt lại thật sự rất nặng nề và đáng sợ. Nhưng hãy nhớ rằng bạn không phải là một chiếc đồng hồ phải chạy theo nhịp kim của người khác. Hôm nay bạn đã can đảm nói ra cảm xúc này — đó là bước đầu tiên để trái tim bạn được thả lỏng.'
    }
  },
  {
    id: 'post-2',
    authorNickname: 'Mầm Xanh Tháng Mười',
    authorSpirit: 'flower',
    title: 'Hôm nay mình đã dám từ chối làm thay bài tập nhóm',
    content: 'Lần đầu tiên trong 3 năm đại học, mình dám nói "Không" khi bạn cùng nhóm đùn đẩy hết phần thuyết trình cho mình vào phút chót. Tim đập thình thịch, tay run bần bật, nhưng khi nói xong mình thấy nhẹ nhõm vô cùng. Một bước tiến nhỏ của đứa chuyên overthinking.',
    moodId: 'tender',
    category: 'ban-than',
    categoryLabelVi: 'Phát triển bản thân',
    hashtags: ['ranhgioi', 'canbang', 'yeubanthanno'],
    supportiveCount: 82,
    userReacted: true,
    userReactionType: 'hug',
    createdAt: '2026-10-30T17:15:00Z',
    isPrivate: false,
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorNickname: 'Cú Đêm Lặng Lẽ',
        authorAvatar: 'bunny',
        content: 'Tự hào về bạn ghê! Đặt ranh giới cho bản thân là biểu hiện cao nhất của việc tự yêu thương mình đấy.',
        createdAt: '2026-10-30T17:40:00Z'
      }
    ],
    tellieReply: {
      spiritName: 'Tellie Spirit',
      badgeVi: 'Lời vỗ về từ Tellie',
      message: 'Chúc mừng bạn! Nói "Không" với sự bất công chính là nói "Có" với sự bình yên của tâm hồn bạn. Hãy ôm lấy chính mình vì lòng dũng cảm này nhé.'
    }
  },
  {
    id: 'post-3',
    authorNickname: 'Gió Đêm Xứ Lạ',
    authorSpirit: 'cloud',
    title: 'Năm nhất xa nhà, bữa cơm một mình trong phòng trọ',
    content: 'Nấu một bát mì gói, mở cuộc gọi video với mẹ nhưng phải cố cười thật tươi để mẹ không lo. Cúp máy xong thì căn phòng trọ 15m2 im ắng đến rợn ngợp. Thành phố này hoa lệ quá, nhưng sao mình thấy nhớ góc bếp quê nhà da diết...',
    moodId: 'heavy',
    category: 'gia-dinh',
    categoryLabelVi: 'Gia đình & Xa nhà',
    hashtags: ['xanha', 'nhatro', 'buacommotminh'],
    supportiveCount: 114,
    userReacted: false,
    createdAt: '2026-10-30T14:30:00Z',
    isPrivate: false,
    comments: [
      {
        id: 'c-4',
        postId: 'post-3',
        authorNickname: 'Đốm Lửa Nhỏ',
        authorAvatar: 'star',
        content: 'Đồng cảnh ngộ bạn ơi, năm nhất ai cũng trải qua những đêm tủi thân như thế. Bật một bài nhạc nhẹ, đắp chăn ấm nha bạn, mọi thứ sẽ quen dần thôi.',
        createdAt: '2026-10-30T15:10:00Z'
      }
    ],
    tellieReply: {
      spiritName: 'Tellie Spirit',
      badgeVi: 'Lời vỗ về từ Tellie',
      message: 'Nỗi nhớ nhà là bằng chứng cho thấy bạn đang được yêu thương rất nhiều. Thành phố có thể xa lạ, nhưng ở Tellie luôn có những người bạn lắng nghe và đồng hành cùng bạn mỗi đêm.'
    }
  },
  {
    id: 'post-4',
    authorNickname: 'Trăng Tròn #108',
    authorSpirit: 'moon',
    title: 'Deadline dí 3 môn cùng lúc, mất ngủ 3 đêm liền',
    content: 'Cảm giác như đầu óc mình sắp nổ tung, nhìn chữ nào cũng lú lẫn. Mình muốn tắt điện thoại ngủ một mạch 24 tiếng nhưng nỗi sợ không kịp nộp bài cứ đè nặng lồng ngực...',
    moodId: 'exhausted',
    category: 'hoc-tap',
    categoryLabelVi: 'Áp lực học tập',
    hashtags: ['deadline', 'matngu', 'kietsuc'],
    supportiveCount: 63,
    userReacted: false,
    createdAt: '2026-10-30T11:00:00Z',
    isPrivate: false,
    comments: [],
    tellieReply: {
      spiritName: 'Tellie Spirit',
      badgeVi: 'Lời vỗ về từ Tellie',
      message: 'Khi một cỗ máy nóng quá, nó cần được ngắt điện trước khi bốc khói. Ngay lúc này, hãy nhắm mắt lại 15 phút. Bạn không thể làm tốt nếu bản thân kiệt sức. Bạn xứng đáng được nghỉ ngơi.'
    }
  }
];

export const INITIAL_MOOD_HISTORY: MoodEntry[] = [
  {
    id: 'm-1',
    moodId: 'calm',
    note: 'Sáng nay uống trà hoa cúc và đọc vài trang sách trước giờ lên giảng đường.',
    timestamp: '2026-10-25T08:30:00Z'
  },
  {
    id: 'm-2',
    moodId: 'heavy',
    note: 'Bài kiểm tra toán xác suất khó hơn dự kiến, hơi lo lắng về điểm quá trình.',
    timestamp: '2026-10-26T16:00:00Z'
  },
  {
    id: 'm-3',
    moodId: 'anxious',
    note: 'Họp nhóm đồ án đến tận 11h đêm nhưng chưa thống nhất được đề tài.',
    timestamp: '2026-10-27T23:15:00Z',
    isNightRitual: true
  },
  {
    id: 'm-4',
    moodId: 'lost',
    note: 'Tự hỏi sau khi tốt nghiệp mình sẽ làm gì và ở đâu trong thành phố này...',
    timestamp: '2026-10-28T21:40:00Z',
    isNightRitual: true
  },
  {
    id: 'm-5',
    moodId: 'tender',
    note: 'Được bạn cùng phòng mua cho ly chè đậu đỏ an ủi, thấy ấm lòng lạ kỳ.',
    timestamp: '2026-10-29T20:10:00Z'
  },
  {
    id: 'm-6',
    moodId: 'hopeful',
    note: 'Hôm nay trời thu rất trong, nộp được bản thảo đầu tiên của bài nghiên cứu.',
    timestamp: '2026-10-30T15:20:00Z'
  }
];

export const INITIAL_GARDEN_PLANTS: GardenPlant[] = [
  {
    id: 'plant-1',
    title: 'Vượt qua kỳ thi giữa kỳ UEH',
    note: 'Dù trước đó mất ngủ nhiều đêm, mình đã làm hết sức và hoàn thành bài thi trọn vẹn.',
    category: 'Học tập',
    plantType: 'leafy',
    plantNameVi: 'Cây Dương Xỉ Kiên Trì',
    plantedAt: '2026-10-18T10:00:00Z',
    currentStage: 'special',
    color: '#91B8E8',
    history: [
      { stage: 'seed', date: '18/10/2026', note: 'Gieo hạt mầm quyết tâm khi bắt đầu ôn thi' },
      { stage: 'sprout', date: '21/10/2026', note: 'Hoàn thành 3 đề cương đầu tiên' },
      { stage: 'sapling', date: '24/10/2026', note: 'Thức khuya cùng đồng đội ôn bài' },
      { stage: 'growing', date: '27/10/2026', note: 'Bước vào phòng thi với tâm thế bình thản' },
      { stage: 'mature', date: '29/10/2026', note: 'Đã hoàn thành và tự thưởng một buổi tối nghỉ ngơi' },
      { stage: 'special', date: '30/10/2026', note: 'Trở thành cột mốc tự hào trong tim' }
    ]
  },
  {
    id: 'plant-2',
    title: 'Dám trải lòng với người bạn thân',
    note: 'Lần đầu tiên mở lòng nói về những bất an gia đình mà bấy lâu nay luôn giấu kín trong lòng.',
    category: 'Mối quan hệ',
    plantType: 'flower',
    plantNameVi: 'Hoa Trăng Đêm Thấu Cảm',
    plantedAt: '2026-10-24T19:30:00Z',
    currentStage: 'growing',
    color: '#F4EEDC',
    history: [
      { stage: 'seed', date: '24/10/2026', note: 'Gieo hạt dũng cảm' },
      { stage: 'sprout', date: '26/10/2026', note: 'Nhận được sự thấu hiểu chân thành' },
      { stage: 'sapling', date: '28/10/2026', note: 'Khoảng cách giữa hai người dường như biến mất' },
      { stage: 'growing', date: '30/10/2026', note: 'Cây đang lớn với niềm tin mới vững vàng' }
    ]
  },
  {
    id: 'plant-3',
    title: 'Học cách ngủ sớm trước 11h',
    note: 'Rời xa màn hình điện thoại, đọc sách giấy và nghe tiếng mưa để bảo vệ giấc ngủ.',
    category: 'Chăm sóc bản thân',
    plantType: 'clover',
    plantNameVi: 'Cỏ Sao Bình Yên',
    plantedAt: '2026-10-28T22:00:00Z',
    currentStage: 'sprout',
    color: '#A8D2C4',
    history: [
      { stage: 'seed', date: '28/10/2026', note: 'Hạt giống của giấc ngủ bình yên' },
      { stage: 'sprout', date: '30/10/2026', note: 'Mầm non xanh tươi sau 2 đêm ngủ ngon' }
    ]
  },
  {
    id: 'plant-4',
    title: 'Bắt đầu học đàn Kalimba mỗi tối',
    note: 'Dành 15 phút nghe âm thanh gõ nhẹ của phím đàn để xoa dịu tâm trí sau giờ học.',
    category: 'Thói quen mới',
    plantType: 'bush',
    plantNameVi: 'Cây Bụi Âm Nhạc',
    plantedAt: '2026-10-30T21:00:00Z',
    currentStage: 'seed',
    color: '#DFAFC8',
    history: [
      { stage: 'seed', date: '30/10/2026', note: 'Hạt giống đầu tiên vừa được gieo trong đất ấm' }
    ]
  }
];

export const AFFIRMATION_CARDS = [
  {
    id: 'card-1',
    title: 'Cho phép mình được mệt',
    body: 'Bạn không cần lúc nào cũng phải mạnh mẽ hay tích cực. Hôm nay được mệt, được yếu lòng, và được cần một chỗ dựa.',
    spiritHint: 'Bunny Spirit gửi gắm',
    color: '#DFAFC8'
  },
  {
    id: 'card-2',
    title: 'Hơi thở là mỏ neo',
    body: 'Khi mọi suy nghĩ rối bời như cuộn len, hãy kéo tâm trí quay về hơi thở vào và hơi thở ra. Hiện tại này bạn đang an toàn.',
    spiritHint: 'Cloud Spirit gửi gắm',
    color: '#91B8E8'
  },
  {
    id: 'card-3',
    title: 'Mỗi bông hoa có mùa riêng',
    body: 'Đừng so sánh sự khởi đầu của bạn với chương giữa của người khác. Bạn đang đi đúng tiến độ của cuộc đời mình.',
    spiritHint: 'Flower Spirit gửi gắm',
    color: '#A8D2C4'
  },
  {
    id: 'card-4',
    title: 'Vết nứt đón ánh sáng',
    body: 'Những tổn thương hay khuyết điểm không làm bạn bớt đi giá trị. Đó là nơi lòng trắc ẩn và sự thấu hiểu bắt đầu len vào.',
    spiritHint: 'Moon Spirit gửi gắm',
    color: '#B9A9E8'
  },
  {
    id: 'card-5',
    title: 'Bạn đã làm rất tốt rồi',
    body: 'Chỉ riêng việc bạn vẫn kiên trì thức dậy và đi qua ngày hôm nay đã là một kỳ tích đáng để tự hào.',
    spiritHint: 'Star Spirit gửi gắm',
    color: '#F4EEDC'
  }
];
