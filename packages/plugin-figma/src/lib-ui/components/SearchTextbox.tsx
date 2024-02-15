import { SearchTextbox as SearchInput, type SearchTextboxProps } from '@create-figma-plugin/ui'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Component, type JSX, createRef, h } from 'preact'

export class SearchTextbox extends Component<SearchTextboxProps> {
  #ref = createRef<HTMLInputElement>()

  override componentDidMount(): void {
    // The input tag type is text in the figma plugin component, and it is in a form, so the submit is triggered by the Enter key. Change the type to search.

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    this.#ref.current!.type = 'search'
  }

  render(props: SearchTextboxProps) {
    // Avoid the issue where input is cleared by pressing the Enter key
    const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
      }

      if (props.onKeyDown) {
        props.onKeyDown(event)
      }
    }

    return <SearchInput {...props} ref={this.#ref} onKeyDown={handleKeyDown}/>
  }
}
