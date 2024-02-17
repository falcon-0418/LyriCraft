// import { CompositeDecorator, ContentBlock, ContentState } from 'draft-js';
// import Link from './link';

// export const findLinkEntities = (
//   contentBlock: ContentBlock,
//   callback: (start: number, end: number) => void,
//   contentState: ContentState
// ) => {
//   contentBlock.findEntityRanges(
//     (character) => {
//       const entityKey = character.getEntity();
//       const isLink = entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
//       console.log(`Entity found: ${isLink}, Entity Key: ${entityKey}`); // ログ出力
//       return isLink;
//     },
//     callback
//   );
// };

// export const decorator = new CompositeDecorator([
//   {
//     strategy: findLinkEntities,
//     component: Link,
//   },
// ]);
