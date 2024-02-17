// import { ContentState } from 'draft-js';
// import React from 'react';

// interface LinkComponentProps {
//   contentState: ContentState;
//   entityKey: string;
//   children: React.ReactNode;
// }

// const Link: React.FC<LinkComponentProps> = ({ contentState, entityKey, children }) => {
//   const entityData = contentState.getEntity(entityKey).getData();
//   const { url } = entityData;

//   const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault(); // エディタ内でのデフォルトの動作を防ぐ
//     window.open(url, '_blank'); // 新しいタブでURLを開く
//   };

//   return (
//     <a className="cursol-pointer" href={url} onClick={handleClick} >
//       {children}
//     </a>
//   );
// };

// export default Link;
