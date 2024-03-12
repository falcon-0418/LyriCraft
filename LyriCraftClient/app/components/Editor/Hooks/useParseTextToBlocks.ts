import { ContentBlock, genKey } from 'draft-js';

interface CustomBlock {
  text: string;
  type: string;
}

const useParseTextToBlocks = (text: string): ContentBlock[] => {
    const blocks: CustomBlock[] = [];
    const lines = text.split('\n');

    lines.forEach(line => {
        if (line.startsWith('#')) {
            blocks.push({
                text: line.replace('#', '').trim(),
                type: 'header-one',
            });
        } else if (line.startsWith('/')) {
            blocks.push({
                text: line.replace('/', '').trim(),
                type: 'blockquote',
            });
        } else if (line.startsWith(':')) {
            blocks.push({
                text: line.replace(':', '').trim(),
                type: 'unstyled',
            });
        } else {
            blocks.push({
                text: line,
                type: 'unstyled',
            });
        }
    });

    return blocks.map(block => new ContentBlock({
        key: genKey(),
        type: block.type,
        text: block.text,
    }));
};
export default useParseTextToBlocks;