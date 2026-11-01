import { SpiritMetadata, SpiritId } from '../types';

export const SPIRITS_LIST: SpiritMetadata[] = [
  {
    id: 'cloud',
    nameDefault: 'Cloudy',
    speciesVi: 'Tiên Nữ Mây Mềm',
    titleVi: 'Cloud Fairy',
    descriptionVi: 'Đôi cánh mây ôm ấp những muộn phiền bằng sự nhẹ nhõm, giúp lòng bạn bồng bềnh và thanh thản như bầu trời sau mưa.',
    personalityVi: 'Dịu dàng, an tĩnh, luôn nhắc nhở bạn hít thở chậm lại.',
    quoteVi: '“Nỗi buồn rồi cũng như mây thôi, cứ để nó trôi qua nhẹ nhàng bạn nhé.”',
    accentColor: '#91B8E8',
    glowColor: 'rgba(145, 184, 232, 0.45)',
    elementVi: 'Đôi cánh Mây & Hơi thở'
  },
  {
    id: 'bunny',
    nameDefault: 'Lumi',
    speciesVi: 'Tiên Nữ Thỏ Trăng',
    titleVi: 'Bunny Fairy',
    descriptionVi: 'Đôi tai nhỏ nhắn và đôi cánh phát sáng luôn chăm chú lắng nghe mọi điều thầm kín bạn chẳng biết tỏ cùng ai.',
    personalityVi: 'Ấm áp, nhạy cảm, luôn bên cạnh trong những đêm khuya thao thức.',
    quoteVi: '“Mình ở đây rồi, tai mình rộng lắm, bạn cứ kể hết cho mình nghe.”',
    accentColor: '#DFAFC8',
    glowColor: 'rgba(223, 175, 200, 0.45)',
    elementVi: 'Đôi cánh Trắc ẩn & Lắng nghe'
  },
  {
    id: 'moon',
    nameDefault: 'Selene',
    speciesVi: 'Tiên Nữ Vầng Trăng',
    titleVi: 'Moon Fairy',
    descriptionVi: 'Tỏa ánh trăng huyền ảo từ đôi cánh bạc xoa dịu những âu lo và thắp sáng những lối đi mờ mịt giữa áp lực cuộc sống.',
    personalityVi: 'Trầm tĩnh, thấu suốt, mang lại sự vững vàng từ sâu trong tâm trí.',
    quoteVi: '“Ngay cả khi bạn thấy mình khuyết đi, bạn vẫn luôn phát sáng theo cách riêng.”',
    accentColor: '#B9A9E8',
    glowColor: 'rgba(185, 169, 232, 0.5)',
    elementVi: 'Đôi cánh Ánh trăng & Tĩnh lặng'
  },
  {
    id: 'flower',
    nameDefault: 'Hilulu',
    speciesVi: 'Tiên Nữ Hoa Đêm',
    titleVi: 'Flower Fairy',
    descriptionVi: 'Sinh ra từ sương đêm và đôi cánh hương hoa dịu mát, nhắc nhở bạn rằng mỗi tâm hồn đều có một mùa nở rộ của riêng mình.',
    personalityVi: 'Bao dung, hy vọng, biết nuôi dưỡng những chồi non niềm tin.',
    quoteVi: '“Đừng vội vã với bản thân. Bạn vẫn đang kiên nhẫn lớn lên mỗi ngày.”',
    accentColor: '#A8D2C4',
    glowColor: 'rgba(168, 210, 196, 0.45)',
    elementVi: 'Đôi cánh Mầm sống & Tái sinh'
  },
  {
    id: 'star',
    nameDefault: 'Stella',
    speciesVi: 'Tiên Nữ Ngôi Sao',
    titleVi: 'Star Fairy',
    descriptionVi: 'Lấp lánh đôi cánh bụi sao băng giữa màn đêm, thắp lên ngọn lửa nhỏ của niềm tin và sự can đảm khi bạn kiệt sức.',
    personalityVi: 'Tươi sáng, khích lệ, nhắc bạn về những điều tốt đẹp nhỏ bé.',
    quoteVi: '“Dù bóng tối có rộng lớn đến đâu, bạn vẫn là một vì sao sáng lấp lánh.”',
    accentColor: '#F4EEDC',
    glowColor: 'rgba(244, 238, 220, 0.5)',
    elementVi: 'Đôi cánh Tia sáng & Hy vọng'
  },
  {
    id: 'mushroom',
    nameDefault: 'Shroomy',
    speciesVi: 'Tiên Nữ Nấm Rừng',
    titleVi: 'Mushroom Fairy',
    descriptionVi: 'Đôi cánh phát sáng dịu êm mang hơi thở rừng già bí mật, mang đến cảm giác an toàn và sự tiếp đất trọn vẹn khi bạn chao đảo.',
    personalityVi: 'Hiền hòa, vững chãi, kiên định như lòng đất mẹ yêu thương.',
    quoteVi: '“Hãy thả lỏng vai xuống nào. Đất mẹ dưới chân luôn đỡ lấy bạn an toàn.”',
    accentColor: '#B9A9E8',
    glowColor: 'rgba(185, 169, 232, 0.4)',
    elementVi: 'Đôi cánh Tiếp đất & An trú'
  },
  {
    id: 'fairy',
    nameDefault: 'Hilulu',
    speciesVi: 'Tiên Nữ Huyền Diệu',
    titleVi: 'Fairy Spirit',
    descriptionVi: 'Đôi cánh phát sáng diệu kỳ mang theo bụi phấn trăng, xua tan bóng tối và thắp sáng những ước mơ thầm lặng trong bạn.',
    personalityVi: 'Mộng mơ, ấm áp, thấu cảm và luôn tràn đầy ánh sáng chữa lành.',
    quoteVi: '“Hãy để đôi cánh của mình chở che cho những giấc mơ bình yên nhất của bạn.”',
    accentColor: '#B9A9E8',
    glowColor: 'rgba(185, 169, 232, 0.55)',
    elementVi: 'Bụi sao & Đôi cánh diệu kỳ'
  }
];

export const getSpiritById = (id: SpiritId): SpiritMetadata => {
  return SPIRITS_LIST.find(s => s.id === id) || SPIRITS_LIST[3]; // defaults to Flower Fairy / Fairy
};
