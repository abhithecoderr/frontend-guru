/**
 * Custom hook to handle real-time resizing of canvas components.
 * Extracted from NodeRenderer.jsx to decouple geometric layout resizing.
 */
export default function useNodeResizer(node, wrapperRef, actions) {
  const left = node.props?.left ?? 50;
  const top = node.props?.top ?? 50;

  function handleResizeStart(e, direction) {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : (node.props.width || 350);
    const startHeight = wrapperRef.current ? wrapperRef.current.offsetHeight : (node.props.height || 120);

    const parentEl = wrapperRef.current ? wrapperRef.current.parentElement : null;
    const parentWidth = parentEl ? parentEl.offsetWidth : 1280;
    const parentHeight = parentEl ? parentEl.offsetHeight : 650;

    const maxAllowedWidth = Math.max(50, parentWidth - left);
    const maxAllowedHeight = Math.max(20, parentHeight - top);

    let minRequiredHeight = node.props.minHeight !== undefined ? node.props.minHeight : 20;

    let finalWidth = startWidth;
    let finalHeight = startHeight;

    wrapperRef.current?.classList.add('resizing');

    function handleMouseMove(moveEvent) {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (direction === 'e' || direction === 'se') {
        finalWidth = Math.min(maxAllowedWidth, Math.max(50, startWidth + deltaX));
        if (wrapperRef.current) {
          wrapperRef.current.style.width = `${finalWidth}px`;
        }
        actions.updatePropsSilent(node.id, { width: finalWidth });
      }

      if (direction === 's' || direction === 'se') {
        finalHeight = Math.min(maxAllowedHeight, Math.max(minRequiredHeight, startHeight + deltaY));
        if (wrapperRef.current) {
          wrapperRef.current.style.height = `${finalHeight}px`;
        }
        actions.updatePropsSilent(node.id, { height: finalHeight });
      }
    }

    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      wrapperRef.current?.classList.remove('resizing');

      const newProps = {};
      if (direction === 'e' || direction === 'se') {
        newProps.width = finalWidth;
      }
      if (direction === 's' || direction === 'se') {
        newProps.height = finalHeight;
      }

      actions.updateProps(node.id, newProps);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  return { handleResizeStart };
}
